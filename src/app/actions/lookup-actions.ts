'use server'

import { prisma } from '@/lib/db'

export async function getAreas() {
    return await prisma.area.findMany()
}

export async function getGroups() {
    return await prisma.group.findMany()
}
