'use server'

import {Member, Prisma} from '@prisma/client'
import {revalidatePath} from 'next/cache'

import {calculateSao, createId, prisma, removeAccents} from '@/lib'
import {ActionResponse, CreateMemberDTO} from '@/types'

export type GetMembersParams = {
  areaId?: string
  // string from URL params
  groupId?: string
  name?: string
  page?: number
  pageSize?: number
  sao?: string
}

export async function getMembers({page = 1, pageSize = 20, name, areaId, groupId, sao}: GetMembersParams = {}) {
  const skip = (page - 1) * pageSize
  const take = pageSize

  // Base where condition for Area and Group (DB-level filtering)
  const familyFilter: Prisma.FamilyWhereInput = {}
  if (areaId && areaId !== 'ALL') {
    familyFilter.areaId = areaId
  }
  if (groupId && groupId !== 'ALL') {
    familyFilter.groupId = groupId
  }

  const where: Prisma.MemberWhereInput = {}
  if (Object.keys(familyFilter).length > 0) {
    where.family = familyFilter
  }

  // If we have name or sao, we need to do in-memory filtering or fetch all candidates
  const hasInmemoryFilters = (name && name.trim() !== '') || (sao && sao !== 'ALL')

  if (hasInmemoryFilters) {
    const candidates = await prisma.member.findMany({
      where,
      include: {
        family: true,
      },
      orderBy: {
        birthYear: 'asc',
      },
    })

    const currentYear = new Date().getFullYear()
    const normalizedQuery = name ? removeAccents(name) : ''

    const filtered = candidates.filter((m) => {
      // Name filter (accent-insensitive)
      if (normalizedQuery) {
        const normalizedFullName = removeAccents(m.fullName)
        const normalizedFamilyName = removeAccents(m.family.name)
        if (!normalizedFullName.includes(normalizedQuery) && !normalizedFamilyName.includes(normalizedQuery)) {
          return false
        }
      }

      // Sao filter
      if (sao && sao !== 'ALL') {
        const calculatedSao = calculateSao(m.birthYear, m.gender, currentYear)
        if (calculatedSao !== sao) return false
      }

      return true
    })

    const total = filtered.length
    const paginatedItems = filtered.slice(skip, skip + take)

    // Since we already have the full data from findMany candidates (with family),
    // we might just need to ensure consistency.
    // For large datasets, fetching 'id' first is better.
    // But candidate set is already filtered by Area/Group in DB.

    // To be efficient, we already included basic family info.
    // Let's fetch the full include structure for the final page if needed,
    // or just use what we have if it's enough.
    // The original code re-fetches with full includes for the paginated page.

    const paginatedIds = paginatedItems.map((m) => m.id)
    const data = await prisma.member.findMany({
      where: {
        id: {in: paginatedIds},
      },
      include: {
        family: {
          include: {
            group: true,
            area: true,
          },
        },
      },
      orderBy: {
        birthYear: 'asc',
      },
    })

    return {data, total}
  }

  // Standard DB pagination path (when no name or sao filter)
  const [total, data] = await prisma.$transaction([
    prisma.member.count({where}),
    prisma.member.findMany({
      where,
      include: {
        family: {
          include: {
            group: true,
            area: true,
          },
        },
      },
      orderBy: {
        birthYear: 'asc',
      },
      skip,
      take,
    }),
  ])

  return {data, total}
}

export async function getMembersByFamily(familyId: string) {
  return await prisma.member.findMany({
    where: {familyId},
    orderBy: {
      birthYear: 'asc', // Older people first (smaller year)
    },
  })
}

export async function createMemberAction(data: CreateMemberDTO): Promise<ActionResponse<Member>> {
  try {
    // Transaction to update representative if needed
    const member = await prisma.$transaction(async (tx) => {
      const newMember = await tx.member.create({
        data: {
          id: createId('mem'),
          fullName: data.fullName,
          birthYear: data.birthYear,
          gender: data.gender,
          familyId: data.familyId,
        },
      })

      if (data.isRepresentative) {
        await tx.family.update({
          where: {id: data.familyId},
          data: {representativeId: newMember.id},
        })
      }
      return newMember
    })

    revalidatePath(`/family/${data.familyId}`)
    return {success: true, data: member}
  } catch (error) {
    console.error(error)
    return {success: false, error: 'Failed to create member'}
  }
}

export async function updateMemberAction(id: string, data: Partial<CreateMemberDTO>): Promise<ActionResponse> {
  try {
    await prisma.member.update({
      where: {id},
      data: {
        fullName: data.fullName,
        birthYear: data.birthYear,
        gender: data.gender,
        // familyId usually doesn't change easily, but possible
      },
    })

    if (data.isRepresentative !== undefined) {
      // handle toggle representative?
      // If true, set. If false? Maybe check if currently representative.
    }

    revalidatePath('/')
    return {success: true}
  } catch {
    return {success: false, error: 'Failed to update member'}
  }
}

export async function deleteMemberAction(id: string): Promise<ActionResponse> {
  try {
    await prisma.member.delete({
      where: {id},
    })
    revalidatePath('/')
    return {success: true}
  } catch {
    return {success: false, error: 'Failed to delete member'}
  }
}
