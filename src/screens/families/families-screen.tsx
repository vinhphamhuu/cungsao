import {getAreas, getFamilies, getGroups} from '@/app/actions'

import {CreateFamilyDialog, FamilyFilters, FamilyList} from './components'

export async function FamiliesScreen(props: {
  searchParams?: Promise<{
    areaId?: string
    groupId?: string
    query?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  const areaId = searchParams?.areaId
  const groupId = searchParams?.groupId

  const families = await getFamilies(query, areaId, groupId)
  const areas = await getAreas()
  const groups = await getGroups()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Danh sách Gia Đình</h1>
          <p className="text-muted-foreground">Quản lý các hộ gia đình và thành viên.</p>
        </div>
        <div className="flex items-center gap-2">
          <CreateFamilyDialog areas={areas} groups={groups} />
        </div>
      </div>

      <FamilyFilters areas={areas} groups={groups} />

      <FamilyList
        key={JSON.stringify({query, areaId, groupId})} // Reset state when filters change
        initialFamilies={families}
        areas={areas}
        groups={groups}
        query={query}
        areaId={areaId}
        groupId={groupId}
      />
    </div>
  )
}
