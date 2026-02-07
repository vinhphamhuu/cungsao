import {Area, Gender, Member} from '@prisma/client'

export type CreateMemberDTO = {
  birthYear: number
  familyId: number
  fullName: string
  gender: Gender
  isRepresentative?: boolean
}

export interface MemberWithFamily extends Member {
  age?: number
  family: {
    area?: Area
    areaId: number
    groupId: number
    id: number
    name: string
  }
  sao?: string
}
