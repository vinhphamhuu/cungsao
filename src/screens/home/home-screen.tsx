import {AlertTriangle, MapPin, User, Users} from 'lucide-react'

import {getDashboardStats} from '@/app/actions'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui'

import {AgeGenderChart, GenderPieChart, SaoChart} from './components'

export async function HomeScreen() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent pb-1">
          Bảng điều khiển
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Chào mừng bạn quay lại. Dưới đây là phân tích chi tiết về dữ liệu cúng sao và nhân khẩu học của hệ thống.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Gia Đình',
            value: stats.families,
            icon: <Users className="h-5 w-5" />,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            title: 'Thành viên',
            value: stats.members,
            sub: `${stats.male} Nam / ${stats.female} Nữ`,
            icon: <User className="h-5 w-5" />,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
          },
          {
            title: 'Sao Xấu',
            value: stats.badStars,
            sub: 'Cần cúng giải hạn',
            icon: <AlertTriangle className="h-5 w-5" />,
            color: 'text-rose-600',
            bg: 'bg-rose-50 dark:bg-rose-900/20',
          },
          {
            title: 'Khu vực',
            value: stats.areas,
            icon: <MapPin className="h-5 w-5" />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          },
        ].map((item, i) => (
          <Card key={i} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className={`p-1.5 rounded-lg ${item.bg} ${item.color}`}>{item.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value.toLocaleString()}</div>
              {item.sub && <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{item.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AgeGenderChart data={stats.charts.ageGenderGroups} title="Cơ cấu Độ tuổi & Giới tính" />
        </div>
        <div>
          <GenderPieChart male={stats.male} female={stats.female} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SaoChart
          color="#3b82f6"
          data={stats.charts.male}
          title="Phân bổ Sao (Nam)"
          description="Tần suất các sao chiếu mệnh đối với thành viên Nam"
        />
        <SaoChart
          color="#f43f5e"
          data={stats.charts.female}
          title="Phân bổ Sao (Nữ)"
          description="Tần suất các sao chiếu mệnh đối với thành viên Nữ"
        />
      </div>

      <div className="grid gap-6">
        <SaoChart
          color="#10b981"
          data={stats.charts.ageGroups}
          title="Mật độ Thành viên theo Độ tuổi"
          description="Phân tích chi tiết số lượng thành viên phân phối theo từng nhóm tuổi"
        />
      </div>
    </div>
  )
}
