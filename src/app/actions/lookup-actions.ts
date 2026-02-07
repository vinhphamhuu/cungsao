'use server'

import {prisma} from '@/lib'

export async function getAreas() {
  return await prisma.area.findMany()
}

export async function getGroups() {
  return await prisma.group.findMany()
}
