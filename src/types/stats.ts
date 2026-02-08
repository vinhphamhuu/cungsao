export interface DashboardStats {
  areas: number
  badStars: number
  charts: {
    ageGenderGroups: Array<{female: number; male: number; name: string}>
    ageGroups: Array<{name: string; value: number}>
    female: Array<{name: string; value: number}>
    male: Array<{name: string; value: number}>
  }
  families: number
  female: number
  male: number
  members: number
}
