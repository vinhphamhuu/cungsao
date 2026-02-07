'use server'

import {BAD_STARS, calculateSao, prisma, SAO_LIST} from '@/lib'
import {DashboardStats} from '@/types'

export async function getDashboardStats(): Promise<DashboardStats> {
  const familyCount = await prisma.family.count()
  const areaCount = await prisma.area.count()

  const allMembers = await prisma.member.findMany({
    select: {
      birthYear: true,
      gender: true,
    },
  })

  const memberCount = allMembers.length
  const maleCount = allMembers.filter((m) => m.gender === 'MALE').length
  const femaleCount = allMembers.filter((m) => m.gender === 'FEMALE').length

  const currentYear = new Date().getFullYear()
  let badStarCount = 0

  // Initialize stats containers
  const maleStars: Record<string, number> = {}
  const femaleStars: Record<string, number> = {}

  SAO_LIST.forEach((sao) => {
    maleStars[sao] = 0
    femaleStars[sao] = 0
  })

  allMembers.forEach((m) => {
    const sao = calculateSao(m.birthYear, m.gender, currentYear)
    if (BAD_STARS.includes(sao)) {
      badStarCount++
    }

    if (m.gender === 'MALE') {
      if (maleStars[sao] !== undefined) maleStars[sao]++
    } else {
      if (femaleStars[sao] !== undefined) femaleStars[sao]++
    }
  })

  // Format for charts
  const maleChartData = SAO_LIST.map((sao) => ({name: sao, value: maleStars[sao]}))
  const femaleChartData = SAO_LIST.map((sao) => ({name: sao, value: femaleStars[sao]}))

  return {
    families: familyCount,
    members: memberCount,
    areas: areaCount,
    male: maleCount,
    female: femaleCount,
    badStars: badStarCount,
    charts: {
      male: maleChartData,
      female: femaleChartData,
    },
  }
}
