import {AlertTriangle, MapPin, User, Users} from 'lucide-react'
import Link from 'next/link'

import {getDashboardStats} from '@/app/actions'
import {SaoChart} from '@/components/dashboard/sao-chart'
import {Button, Card, CardContent, CardHeader, CardTitle} from '@/components/ui'

export default async function Home() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trang chủ</h1>
        <p className="text-muted-foreground">Tổng quan hệ thống quản lý danh sách cúng sao.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số Gia Đình</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.families}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành viên</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.members}</div>
            <p className="text-xs text-muted-foreground">
              {stats.male} Nam / {stats.female} Nữ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sao Xấu Năm Nay</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.badStars}</div>
            <p className="text-xs text-muted-foreground">(La Hầu, Kế Đô, Thái Bạch)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khu vực / Chùa</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.areas}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/families">Quản lý Gia Đình</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/cung-sao">Tra Cứu Cúng Sao</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SaoChart data={stats.charts.male} title="Thống kê Sao (Nam)" color="#2563eb" />
        <SaoChart data={stats.charts.female} title="Thống kê Sao (Nữ)" color="#e11d48" />
      </div>
    </div>
  )
}
