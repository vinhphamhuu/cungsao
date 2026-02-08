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

  const ageBrackets = [
    {name: '0-10', min: 0, max: 10},
    {name: '11-20', min: 11, max: 20},
    {name: '21-30', min: 21, max: 30},
    {name: '31-40', min: 31, max: 40},
    {name: '41-50', min: 41, max: 50},
    {name: '51-60', min: 51, max: 60},
    {name: '61-70', min: 61, max: 70},
    {name: '71-80', min: 71, max: 80},
    {name: '81+', min: 81, max: 150},
  ]

  const ageStats: Record<string, {female: number; male: number; total: number}> = {}
  ageBrackets.forEach((b) => {
    ageStats[b.name] = {total: 0, male: 0, female: 0}
  })

  SAO_LIST.forEach((sao) => {
    maleStars[sao] = 0
    femaleStars[sao] = 0
  })

  allMembers.forEach((m) => {
    // Sao stats
    const sao = calculateSao(m.birthYear, m.gender, currentYear)
    if (BAD_STARS.includes(sao)) {
      badStarCount++
    }

    if (m.gender === 'MALE') {
      if (maleStars[sao] !== undefined) maleStars[sao]++
    } else {
      if (femaleStars[sao] !== undefined) femaleStars[sao]++
    }

    // Age stats
    const age = currentYear - m.birthYear
    const bracket = ageBrackets.find((b) => age >= b.min && age <= b.max)
    if (bracket) {
      ageStats[bracket.name].total++
      if (m.gender === 'MALE') {
        ageStats[bracket.name].male++
      } else {
        ageStats[bracket.name].female++
      }
    }
  })

  // Format for charts
  const maleChartData = SAO_LIST.map((sao) => ({name: sao, value: maleStars[sao]}))
  const femaleChartData = SAO_LIST.map((sao) => ({name: sao, value: femaleStars[sao]}))
  const ageGroupData = ageBrackets.map((b) => ({name: b.name, value: ageStats[b.name].total}))
  const ageGenderGroupData = ageBrackets.map((b) => ({
    name: b.name,
    male: ageStats[b.name].male,
    female: ageStats[b.name].female,
  }))

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
      ageGroups: ageGroupData,
      ageGenderGroups: ageGenderGroupData,
    },
  }
}
