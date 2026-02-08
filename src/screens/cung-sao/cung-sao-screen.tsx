import {getAreas, getGroups, getMembers} from '@/app/actions'

import {CungSaoList} from './components'

export async function CungSaoScreen() {
  const {data: members, total} = await getMembers()
  const areas = await getAreas()
  const groups = await getGroups()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Danh sách Cúng Sao</h1>
        <p className="text-muted-foreground">Tổng hợp tất cả thành viên và sao hạn năm nay.</p>
      </div>

      <CungSaoList areas={areas} groups={groups} initialMembers={members} initialTotal={total} />
    </div>
  )
}
