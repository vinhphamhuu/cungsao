import {Area, Group, Member} from '@prisma/client'

export type CreateFamilyDTO = {
  areaId: number
  groupId: number
  name: string
}

export type CreateFamilyWithMembersDTO = {
  areaId: number
  groupId: number
  members: {
    birthYear: number
    fullName: string
    gender: 'MALE' | 'FEMALE'
  }[]
  name: string
}

export interface FamilyWithMembers {
  area: Area
  areaId: number
  createdAt: Date
  group: Group
  groupId: number
  id: number
  members: Array<{
    birthYear: number
    fullName: string
    gender: 'MALE' | 'FEMALE'
    id: number
  }>
  name: string
  representative: Member | null
  representativeId: number | null
  updatedAt: Date
}
