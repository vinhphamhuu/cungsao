'use server'

import {Family, Prisma} from '@prisma/client'
import {revalidatePath} from 'next/cache'

import {createId, prisma} from '@/lib'
import {ActionResponse, CreateFamilyDTO, CreateFamilyWithMembersDTO, FamilyWithMembers} from '@/types'

export async function getFamilies(
  query?: string,
  areaId?: string,
  groupId?: string,
  skip: number = 0,
  take: number = 20,
): Promise<FamilyWithMembers[]> {
  const where: Prisma.FamilyWhereInput = {}

  if (query) {
    where.OR = [
      {name: {contains: query, mode: 'insensitive' as const}},
      {representative: {fullName: {contains: query, mode: 'insensitive' as const}}},
    ]
  }

  if (areaId) where.areaId = areaId
  if (groupId) where.groupId = groupId

  return await prisma.family.findMany({
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
  })
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
          return await tx.family.update({
            where: {id: family.id},
            data: {
              representativeId: firstMemberId,
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
