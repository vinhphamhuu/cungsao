'use client'

import {useState} from 'react'
import {
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
import Link from 'next/link'
import {SaoBadge} from '@/components/cung-sao'

// Need types that include relations
// We can infer or define manually.
// For now assume similar structure as Prisma return.

import {Area, Group, Member} from '@prisma/client'

interface MemberWithFamily extends Member {
  family: {
    id: number
    name: string
    areaId: number
    groupId: number
    area?: Area
  }
}

interface CungSaoTableProps {
  initMembers: MemberWithFamily[]
  areas: Area[]
  groups: Group[]
}

export function CungSaoTable({initMembers, areas, groups}: CungSaoTableProps) {
  const [filterName, setFilterName] = useState('')
  const [filterSao, setFilterSao] = useState('ALL')
  const [filterArea, setFilterArea] = useState('ALL')
  const [filterGroup, setFilterGroup] = useState('ALL')
  const currentYear = new Date().getFullYear()

  // Process data
  const data = initMembers.map((m) => {
    const sao = calculateSao(m.birthYear, m.gender, currentYear)
    return {...m, sao, age: currentYear - m.birthYear + 1}
  })

  const filteredData = data.filter((item) => {
    const matchName =
      item.fullName.toLowerCase().includes(filterName.toLowerCase()) ||
      item.family.name.toLowerCase().includes(filterName.toLowerCase())
    const matchSao = filterSao === 'ALL' || item.sao === filterSao
    const matchArea = filterArea === 'ALL' || item.family.areaId.toString() === filterArea
    const matchGroup = filterGroup === 'ALL' || item.family.groupId.toString() === filterGroup
    return matchName && matchSao && matchArea && matchGroup
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
        <div className="text-sm text-muted-foreground mb-4">Tìm thấy {filteredData.length} kết quả.</div>
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
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.fullName}</TableCell>
                <TableCell>{item.birthYear}</TableCell>
                <TableCell>{item.age}</TableCell>
                <TableCell>{item.gender === 'MALE' ? 'Nam' : 'Nữ'}</TableCell>
                <TableCell>
                  <SaoBadge sao={item.sao} />
                </TableCell>
                <TableCell>
                  <Link href={`/families/${item.family.id}`} className="hover:underline text-blue-500">
                    {item.family.name}
                  </Link>
                </TableCell>
                <TableCell>{item.family.area?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
