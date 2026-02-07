'use server'

import { prisma } from '@/lib'
import { revalidatePath } from 'next/cache'
import { Gender } from '@prisma/client'

export type CreateMemberDTO = {
  fullName: string
  birthYear: number
  gender: Gender
  familyId: number
  isRepresentative?: boolean
}

export async function getAllMembers() {
  return await prisma.member.findMany({
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
}

export async function getMembersByFamily(familyId: number) {
  return await prisma.member.findMany({
    where: { familyId },
    orderBy: {
      birthYear: 'asc', // Older people first (smaller year)
    },
  })
}

export async function createMemberAction(data: CreateMemberDTO) {
  try {
    // Transaction to update representative if needed
    const member = await prisma.$transaction(async (tx) => {
      const newMember = await tx.member.create({
        data: {
          fullName: data.fullName,
          birthYear: data.birthYear,
          gender: data.gender,
          familyId: data.familyId,
        },
      })

      if (data.isRepresentative) {
        await tx.family.update({
          where: { id: data.familyId },
          data: { representativeId: newMember.id },
        })
      }
      return newMember
    })

    revalidatePath(`/families/${data.familyId}`)
    return { success: true, data: member }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to create member' }
  }
}

export async function updateMemberAction(id: number, data: Partial<CreateMemberDTO>) {
  try {
    await prisma.member.update({
      where: { id },
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
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update member' }
  }
}

export async function deleteMemberAction(id: number) {
  try {
    await prisma.member.delete({
      where: { id },
    })
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete member' }
  }
}
