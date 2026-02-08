import Link from 'next/link'

import {getAreas, getFamilies, getGroups} from '@/app/actions'
import {Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui'

import {CreateFamilyDialog, DuplicateFamilyDialog, FamilyFilters, FamilyNameTooltip} from './components'

export async function FamiliesScreen(props: {
  searchParams?: Promise<{
    areaId?: string
    groupId?: string
    query?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  const areaId = searchParams?.areaId ? parseInt(searchParams.areaId) : undefined
  const groupId = searchParams?.groupId ? parseInt(searchParams.groupId) : undefined

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

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Gia Đình</TableHead>
              <TableHead>Người Đại Diện</TableHead>
              <TableHead>Khu vực</TableHead>
              <TableHead>Nhóm</TableHead>
              <TableHead>Thành viên</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {families.length === 0 ? (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={6}>
                  Chưa có gia đình nào.
                </TableCell>
              </TableRow>
            ) : (
              families.map((family) => (
                <TableRow key={family.id}>
                  <TableCell className="font-medium">
                    <FamilyNameTooltip familyId={family.id} familyName={family.name} members={family.members} />
                  </TableCell>
                  <TableCell>{family.representative?.fullName || 'Chưa có'}</TableCell>
                  <TableCell>{family.area?.name}</TableCell>
                  <TableCell>{family.group?.name}</TableCell>
                  <TableCell>{family.members.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <DuplicateFamilyDialog areas={areas} groups={groups} sourceFamily={family} />
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/family/${family.id}`}>Chi tiết</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
