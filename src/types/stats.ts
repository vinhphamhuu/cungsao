export interface DashboardStats {
  areas: number
  badStars: number
  charts: {
    female: Array<{name: string; value: number}>
    male: Array<{name: string; value: number}>
  }
  families: number
  female: number
  male: number
  members: number
}
