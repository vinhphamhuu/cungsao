'use client'

import {Area, Group} from '@prisma/client'
import {Loader2} from 'lucide-react'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import {useDebounce} from 'use-debounce'

import {getMembers} from '@/app/actions/member-actions'
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import {calculateSao, SAO_LIST} from '@/lib'
import {MemberWithFamily} from '@/types'

import {SaoBadge} from './sao-badge'

interface CungSaoListProps {
  areas: Area[]
  groups: Group[]
  initialMembers: MemberWithFamily[]
  initialTotal: number
}

const PAGE_SIZE = 20

export function CungSaoList({initialMembers, initialTotal, areas, groups}: CungSaoListProps) {
  const [members, setMembers] = useState<MemberWithFamily[]>(initialMembers)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Filter states
  const [filterName, setFilterName] = useState('')
  const [debouncedName] = useDebounce(filterName, 500)
  const [filterSao, setFilterSao] = useState('ALL')
  const [filterArea, setFilterArea] = useState('ALL')
  const [filterGroup, setFilterGroup] = useState('ALL')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Refetch when filters change
  useEffect(() => {
    // Skip initial mount refetch because initialMembers are passed
    if (!mounted) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const result = await getMembers({
          page: 1,
          pageSize: PAGE_SIZE,
          name: debouncedName,
          areaId: filterArea,
          groupId: filterGroup,
          sao: filterSao,
        })
        setMembers(result.data as MemberWithFamily[])
        setTotal(result.total)
        setPage(1)
      } catch (error) {
        console.error('Failed to fetch members:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName, filterArea, filterGroup, filterSao])
  // We exclude 'mounted' to avoid double fetch on mount.
  // Actually initial render uses initialMembers.
  // We need to ensure that if debouncedName changes from '' (initial) to something, it fetches.
  // The initial state matches the initial props assuming props are default.
  // If user navigates back, state is lost (unless stored in URL).
  // For now, local state is fine.

  const loadMore = async () => {
    if (loadingMore || members.length >= total) return

    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const result = await getMembers({
        page: nextPage,
        pageSize: PAGE_SIZE,
        name: debouncedName,
        areaId: filterArea,
        groupId: filterGroup,
        sao: filterSao,
      })

      setMembers((prev) => [...prev, ...(result.data as MemberWithFamily[])])
      setPage(nextPage)
      // Total should ideally stay same, but we can update it just in case
      setTotal(result.total)
    } catch (error) {
      console.error('Failed to load more members:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const effectiveYear = new Date().getFullYear()

  // Process data for display (calculate age/sao for rendered list)
  const displayData = members.map((m) => {
    const sao = calculateSao(m.birthYear, m.gender, effectiveYear)
    return {...m, sao, age: effectiveYear - m.birthYear + 1}
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <Input
          placeholder="Tìm theo tên thành viên hoặc gia đình..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="sm:w-[250px]"
        />
        <Select value={filterSao} onValueChange={setFilterSao}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Lọc theo Sao" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả Sao</SelectItem>
            {SAO_LIST.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Khu vực" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả Khu vực</SelectItem>
            {areas.map((a) => (
              <SelectItem key={a.id} value={a.id.toString()}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterGroup} onValueChange={setFilterGroup}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Nhóm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả Nhóm</SelectItem>
            {groups.map((g) => (
              <SelectItem key={g.id} value={g.id.toString()}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card p-4">
        <div className="text-sm text-muted-foreground mb-4">
          {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${total} kết quả.`}
        </div>
        <div className="overflow-auto max-h-[65vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ Tên</TableHead>
                <TableHead>Năm Sinh</TableHead>
                <TableHead>Tuổi</TableHead>
                <TableHead>Giới Tính</TableHead>
                <TableHead>Sao</TableHead>
                <TableHead>Gia Đình</TableHead>
                <TableHead>Khu Vực</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : displayData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Không tìm thấy kết quả phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.fullName}</TableCell>
                    <TableCell>{item.birthYear}</TableCell>
                    <TableCell>{mounted ? item.age : '-'}</TableCell>
                    <TableCell>{item.gender === 'MALE' ? 'Nam' : 'Nữ'}</TableCell>
                    <TableCell>{mounted ? <SaoBadge sao={item.sao} /> : '-'}</TableCell>
                    <TableCell>
                      <Link href={`/family/${item.family.id}`} className="hover:underline text-blue-500">
                        {item.family.name}
                      </Link>
                    </TableCell>
                    <TableCell>{item.family.area?.name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {members.length < total && (
          <div className="flex justify-center mt-4 pt-4 border-t">
            <Button variant="outline" onClick={loadMore} disabled={loadingMore || loading}>
              {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loadingMore ? 'Đang tải thêm...' : 'Xem thêm'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
