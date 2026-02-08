import {Settings} from 'lucide-react'

import {prisma} from '@/lib'

import {AreaManagement, GroupManagement} from './components'

export default async function SettingsScreen() {
  const [areas, groups] = await Promise.all([
    prisma.area.findMany({
      orderBy: {name: 'asc'},
    }),
    prisma.group.findMany({
      orderBy: {name: 'asc'},
    }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Cài đặt</h1>
          <p className="text-muted-foreground">Quản lý cấu hình hệ thống</p>
        </div>
      </div>

      <div className="grid gap-6">
        <AreaManagement areas={areas} />
        <GroupManagement groups={groups} />
      </div>
    </div>
  )
}
