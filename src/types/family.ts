import {Area, Group, Member} from '@prisma/client'

export type CreateFamilyDTO = {
  areaId: string
  groupId: string
  name: string
}

export type CreateFamilyWithMembersDTO = {
  areaId: string
  groupId: string
  members: {
    birthYear: number
    fullName: string
    gender: 'MALE' | 'FEMALE'
  }[]
  name: string
}

export interface FamilyWithMembers {
  area: Area
  areaId: string
  createdAt: Date
  group: Group
  groupId: string
  id: string
  members: Array<{
    birthYear: number
    fullName: string
    gender: 'MALE' | 'FEMALE'
    id: string
  }>
  name: string
  representative: Member | null
  representativeId: string | null
  updatedAt: Date
}
