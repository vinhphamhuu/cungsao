'use server'

import {Family, Prisma} from '@prisma/client'
import {revalidatePath} from 'next/cache'

import {createId, prisma, removeAccents} from '@/lib'
import {ActionResponse, CreateFamilyDTO, CreateFamilyWithMembersDTO, FamilyWithMembers} from '@/types'

export async function getFamilies(
  query?: string,
  areaId?: string,
  groupId?: string,
  skip: number = 0,
  take: number = 20,
): Promise<FamilyWithMembers[]> {
  const where: Prisma.FamilyWhereInput = {}

  if (areaId) where.areaId = areaId
  if (groupId) where.groupId = groupId

  if (query && query.trim() !== '') {
    const normalizedQuery = removeAccents(query)

    // Fetch candidates with necessary fields for filtering
    const candidates = await prisma.family.findMany({
      where,
      include: {
        group: true,
        area: true,
        representative: true,
        members: {
          select: {
            id: true,
            fullName: true,
            birthYear: true,
            gender: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const filtered = candidates.filter((f) => {
      const normalizedName = removeAccents(f.name)
      const normalizedRep = f.representative ? removeAccents(f.representative.fullName) : ''
      return normalizedName.includes(normalizedQuery) || normalizedRep.includes(normalizedQuery)
    })

    return filtered.slice(skip, skip + take) as FamilyWithMembers[]
  }

  return (await prisma.family.findMany({
    where,
    include: {
      group: true,
      area: true,
      representative: true,
      members: {
        select: {
          id: true,
          fullName: true,
          birthYear: true,
          gender: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip,
    take,
  })) as FamilyWithMembers[]
}

// For now, let's implement structured actions accepting objects or FormData.
// I'll prefer typed objects.

export async function createFamilyAction(data: CreateFamilyDTO): Promise<ActionResponse<Family>> {
  try {
    const family = await prisma.family.create({
      data: {
        id: createId('fam'),
        name: data.name,
        groupId: data.groupId,
        areaId: data.areaId,
      },
    })
    revalidatePath('/')
    return {success: true, data: family}
  } catch {
    return {success: false, error: 'Failed to create family'}
  }
}

export async function updateFamilyAction(id: string, data: Partial<CreateFamilyDTO>): Promise<ActionResponse<Family>> {
  try {
    const family = await prisma.family.update({
      where: {id},
      data: {
        ...data,
      },
    })
    revalidatePath('/')
    return {success: true, data: family}
  } catch {
    return {success: false, error: 'Failed to update family'}
  }
}

export async function createFamilyWithMembersAction(data: CreateFamilyWithMembersDTO): Promise<ActionResponse<Family>> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create family
      const family = await tx.family.create({
        data: {
          id: createId('fam'),
          name: data.name,
          groupId: data.groupId,
          areaId: data.areaId,
        },
      })

      let firstMemberId: string | null = null

      // 2. Create members
      if (data.members.length > 0) {
        // Create members one by one or createMany but createMany doesn't return created records in standard SQL/Prisma easily across DBs (though Postgres supports returning).
        // However, we need IDs.
        // Best approach: Generate IDs here and insert.

        const membersWithIds = data.members.map((m) => ({
          ...m,
          id: createId('mem'),
          familyId: family.id,
        }))

        firstMemberId = membersWithIds[0].id

        await tx.member.createMany({
          data: membersWithIds,
        })

        // Update family with the first member as representative
        if (firstMemberId) {
          const firstMember = membersWithIds[0]
          return await tx.family.update({
            where: {id: family.id},
            data: {
              representativeId: firstMemberId,
              name: `Gia đình ${firstMember.fullName}`,
            },
          })
        }
      }

      return family
    })

    revalidatePath('/')
    return {success: true, data: result}
  } catch (error) {
    console.error('Create family with members error:', error)
    return {success: false, error: 'Failed to create family with members'}
  }
}

export async function deleteFamilyAction(id: string): Promise<ActionResponse> {
  try {
    // Delete members first? No, cascade usually handles it or we define logic.
    // Prisma cascade delete:
    await prisma.member.deleteMany({
      where: {familyId: id},
    })

    await prisma.family.delete({
      where: {id},
    })
    revalidatePath('/')
    return {success: true}
  } catch {
    return {success: false, error: 'Failed to delete family'}
  }
}
