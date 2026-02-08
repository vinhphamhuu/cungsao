'use server'

import {revalidatePath} from 'next/cache'

import {createId, prisma} from '@/lib'
import {ActionResult} from '@/types'

export async function createGroupAction(data: {
  areaId?: string
  description?: string
  name: string
}): Promise<ActionResult<{id: string}>> {
  try {
    const group = await prisma.group.create({
      data: {
        id: createId('grp'),
        name: data.name,
        description: data.description,
        areaId: data.areaId,
      },
    })

    revalidatePath('/settings')
    return {success: true, data: {id: group.id}}
  } catch (error) {
    console.error('Error creating group:', error)
    return {success: false, error: 'Không thể tạo nhóm'}
  }
}

export async function updateGroupAction(data: {
  areaId?: string
  description?: string
  id: string
  name: string
}): Promise<ActionResult<{id: string}>> {
  try {
    const group = await prisma.group.update({
      where: {id: data.id},
      data: {
        name: data.name,
        description: data.description,
        areaId: data.areaId,
      },
    })

    revalidatePath('/settings')
    return {success: true, data: {id: group.id}}
  } catch (error) {
    console.error('Error updating group:', error)
    return {success: false, error: 'Không thể cập nhật nhóm'}
  }
}

export async function deleteGroupAction(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.group.delete({
      where: {id},
    })

    revalidatePath('/settings')
    return {success: true}
  } catch (error) {
    console.error('Error deleting group:', error)
    return {success: false, error: 'Không thể xóa nhóm. Có thể đang được sử dụng bởi gia đình.'}
  }
}
