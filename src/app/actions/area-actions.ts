'use server'

import {revalidatePath} from 'next/cache'

import {createId, prisma} from '@/lib'
import {ActionResult} from '@/types'

export async function createAreaAction(data: {
  address: string
  code: string
  name: string
}): Promise<ActionResult<{id: string}>> {
  try {
    const area = await prisma.area.create({
      data: {
        id: createId('ara'),
        name: data.name,
        code: data.code,
        address: data.address,
      },
    })

    revalidatePath('/settings')
    return {success: true, data: {id: area.id}}
  } catch (error) {
    console.error('Error creating area:', error)
    return {success: false, error: 'Không thể tạo khu vực'}
  }
}

export async function updateAreaAction(data: {
  address: string
  code: string
  id: string
  name: string
}): Promise<ActionResult<{id: string}>> {
  try {
    const area = await prisma.area.update({
      where: {id: data.id},
      data: {
        name: data.name,
        code: data.code,
        address: data.address,
      },
    })

    revalidatePath('/settings')
    return {success: true, data: {id: area.id}}
  } catch (error) {
    console.error('Error updating area:', error)
    return {success: false, error: 'Không thể cập nhật khu vực'}
  }
}

export async function deleteAreaAction(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.area.delete({
      where: {id},
    })

    revalidatePath('/settings')
    return {success: true}
  } catch (error) {
    console.error('Error deleting area:', error)
    return {success: false, error: 'Không thể xóa khu vực. Có thể đang được sử dụng bởi gia đình.'}
  }
}
