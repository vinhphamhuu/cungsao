'use server'

import {Member} from '@prisma/client'
import {revalidatePath} from 'next/cache'

import {calculateSao, createId, prisma} from '@/lib'
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

  // Base where condition
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}

  if (name) {
    where.OR = [
      {fullName: {contains: name, mode: 'insensitive'}},
      {family: {name: {contains: name, mode: 'insensitive'}}},
    ]
  }

  if (areaId && areaId !== 'ALL') {
    where.family = {...where.family, areaId: areaId}
  }

  if (groupId && groupId !== 'ALL') {
    where.family = {...where.family, groupId: groupId}
  }

  // Handle 'sao' filtering
  // If filtering by Sao, we need to filter in memory somewhat or use complex query logic.
  // Since 'calculateSao' is complex logic involving modulo arithmetic,
  // we first fetch potential candidates or all if searching globally.
  // Strategy:
  // 1. If Sao filter is set:
  //    - If Name/Area/Group are also set, we fetch based on those first (usually much smaller set).
  //    - Then filter by Sao in memory.
  //    - Then paginate in memory.
  // 2. If Sao filter is NOT set:
  //    - Use DB pagination.

  if (sao && sao !== 'ALL') {
    // 1. Fetch only essential fields for Sao calculation to filter
    const candidates = await prisma.member.findMany({
      where,
      select: {
        id: true,
        birthYear: true,
        gender: true,
      },
      orderBy: {
        birthYear: 'asc',
      },
    })

    const currentYear = new Date().getFullYear()

    // 2. Filter by Sao in memory
    const filteredIds = candidates
      .filter((m) => {
        const calculatedSao = calculateSao(m.birthYear, m.gender, currentYear)
        return calculatedSao === sao
      })
      .map((m) => m.id)

    const total = filteredIds.length

    // 3. Paginate
    const paginatedIds = filteredIds.slice(skip, skip + take)

    // 4. Fetch full data for the current page
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
      // Preserve order roughly by birthYear as in candidates
      orderBy: {
        birthYear: 'asc',
      },
    })

    return {data, total}
  }

  // Standard DB pagination path
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
