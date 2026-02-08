'use client'

import {Area, Group} from '@prisma/client'
import {Loader2} from 'lucide-react'
import Link from 'next/link'
import {useState} from 'react'

import {getFamilies} from '@/app/actions'
import {Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui'
import {FamilyWithMembers} from '@/types'

import {DuplicateFamilyDialog} from './duplicate-family-dialog'
import {FamilyNameTooltip} from './family-name-tooltip'

interface FamilyListProps {
  areaId?: string
  areas: Area[]
  groupId?: string
  groups: Group[]
  initialFamilies: FamilyWithMembers[]
  query?: string
}

const PAGE_SIZE = 20

export function FamilyList({initialFamilies, areas, groups, query, areaId, groupId}: FamilyListProps) {
  const [families, setFamilies] = useState<FamilyWithMembers[]>(initialFamilies)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialFamilies.length >= PAGE_SIZE)
  const [page, setPage] = useState(1)

  const loadMore = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const skip = page * PAGE_SIZE
      const newFamilies = await getFamilies(query, areaId, groupId, skip, PAGE_SIZE)

      if (newFamilies.length < PAGE_SIZE) {
        setHasMore(false)
      }

      setFamilies((prev) => [...prev, ...newFamilies])
      setPage((prev) => prev + 1)
    } catch (error) {
      console.error('Failed to load families:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
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

      {hasMore && (
        <div className="flex justify-center py-4">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Đang tải...' : 'Xem thêm'}
          </Button>
        </div>
      )}
    </div>
  )
}
