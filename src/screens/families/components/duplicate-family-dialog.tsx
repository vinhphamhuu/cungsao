'use client'

import {Area, Group} from '@prisma/client'
import {Check, Copy, Plus, Trash2} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

import {createFamilyWithMembersAction} from '@/app/actions'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
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
import {capitalizeName} from '@/lib/cung-sao-utils'
import {FamilyWithMembers} from '@/types'

interface DuplicateFamilyDialogProps {
  areas: Area[]
  groups: Group[]
  showText?: boolean
  sourceFamily: Pick<FamilyWithMembers, 'id' | 'name' | 'areaId' | 'groupId' | 'members'>
}

export function DuplicateFamilyDialog({sourceFamily, areas, groups, showText}: DuplicateFamilyDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Members state (local copy for editing)
  const initialMembers = sourceFamily.members.map((m) => ({
    fullName: m.fullName,
    birthYear: m.birthYear,
    gender: m.gender as 'MALE' | 'FEMALE',
  }))

  const [members, setMembers] = useState(initialMembers)

  // Form state
  const [name, setName] = useState(`Gia đình ${initialMembers[0]?.fullName || ''}`)
  const [areaId, setAreaId] = useState(sourceFamily.areaId)
  const [groupId, setGroupId] = useState(sourceFamily.groupId)

  const handleAddMember = () => {
    setMembers([...members, {fullName: 'Thành viên mới', birthYear: new Date().getFullYear(), gender: 'MALE'}])
  }

  const handleRemoveMember = (index: number) => {
    const newMembers = [...members]
    newMembers.splice(index, 1)
    setMembers(newMembers)
  }

  const handleMemberChange = <K extends keyof (typeof members)[0]>(
    index: number,
    field: K,
    value: (typeof members)[0][K],
  ) => {
    const newMembers = [...members]
    newMembers[index] = {...newMembers[index], [field]: value}
    setMembers(newMembers)

    // Update family name if first member's name changes
    if (index === 0 && field === 'fullName') {
      setName(`Gia đình ${value}`)
    }
  }

  async function onSubmit() {
    if (!name || !areaId || !groupId) {
      alert('Vui lòng nhập đầy đủ thông tin gia đình.')
      return
    }

    setIsLoading(true)

    const result = await createFamilyWithMembersAction({
      name,
      areaId,
      groupId,
      members: members.map((m) => ({
        ...m,
        fullName: capitalizeName(m.fullName),
      })),
    })

    setIsLoading(false)
    if (result.success && result.data) {
      setOpen(false)
      router.push(`/family/${result.data.id}`)
      router.refresh()
    } else {
      alert('Lỗi: ' + (result.error || 'Không thể tạo gia đình'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={showText ? 'outline' : 'ghost'} size="sm" title="Nhân bản" className={showText ? 'gap-2' : ''}>
          <Copy className="h-4 w-4" />
          {showText && <span>Nhân bản</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Nhân bản Gia Đình</DialogTitle>
          <DialogDescription>
            Tạo bản sao từ gia đình <strong>{sourceFamily.name}</strong>. Bạn có thể chỉnh sửa thông tin trước khi tạo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 pr-2">
          <div className="grid gap-4 mb-6 border p-4 rounded bg-muted/20">
            <Label className="font-bold underline mb-2">Thông tin chung</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên Gia Đình (Tự động)</Label>
                <Input id="name" value={name} readOnly className="bg-muted cursor-not-allowed" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Khu vực</Label>
                  <Select value={areaId} onValueChange={setAreaId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((a) => (
                        <SelectItem key={a.id} value={a.id.toString()}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nhóm</Label>
                  <Select value={groupId} onValueChange={setGroupId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((g) => (
                        <SelectItem key={g.id} value={g.id.toString()}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-bold underline">Danh sách thành viên ({members.length})</Label>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleAddMember}
                type="button"
                className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                <Plus className="h-3 w-3 mr-1" /> Thêm nhanh
              </Button>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%]">Họ Tên</TableHead>
                    <TableHead className="w-[15%] text-blue-600 dark:text-blue-400">Năm Sinh</TableHead>
                    <TableHead className="w-[15%] text-pink-600 dark:text-pink-400">Tuổi (Âm)</TableHead>
                    <TableHead className="w-[25%]">Giới Tính</TableHead>
                    <TableHead className="w-[10%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member, idx) => {
                    const currentYear = new Date().getFullYear()
                    const age = currentYear - member.birthYear + 1

                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          <Input
                            value={member.fullName}
                            onChange={(e) => handleMemberChange(idx, 'fullName', e.target.value)}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={member.birthYear}
                            onChange={(e) => {
                              const by = parseInt(e.target.value) || 0
                              handleMemberChange(idx, 'birthYear', by)
                            }}
                            className="h-8 border-blue-200 focus-visible:ring-blue-500"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={age}
                            onChange={(e) => {
                              const a = parseInt(e.target.value) || 0
                              handleMemberChange(idx, 'birthYear', currentYear - a + 1)
                            }}
                            className="h-8 border-pink-200 focus-visible:ring-pink-500"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex bg-secondary/50 p-0.5 rounded-md w-fit">
                            <button
                              type="button"
                              onClick={() => handleMemberChange(idx, 'gender', 'MALE')}
                              className={`px-2 py-1 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1 ${
                                member.gender === 'MALE'
                                  ? 'bg-background text-blue-600 dark:text-blue-400 shadow-sm'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {member.gender === 'MALE' && <Check className="h-3 w-3" />}
                              Nam
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMemberChange(idx, 'gender', 'FEMALE')}
                              className={`px-2 py-1 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1 ${
                                member.gender === 'FEMALE'
                                  ? 'bg-background text-pink-600 dark:text-pink-400 shadow-sm'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {member.gender === 'FEMALE' && <Check className="h-3 w-3" />}
                              Nữ
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleRemoveMember(idx)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Huỷ
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95"
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận & Tạo mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
