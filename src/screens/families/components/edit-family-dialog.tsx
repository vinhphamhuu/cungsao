'use client'

import {Area, Family, Group} from '@prisma/client'
import {Pencil} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

import {updateFamilyAction} from '@/app/actions'
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
} from '@/components/ui'
import {capitalizeName} from '@/lib/cung-sao-utils'
import {FamilyWithMembers} from '@/types'

interface EditFamilyDialogProps {
  areas: Area[]
  family: Family | FamilyWithMembers
  groups: Group[]
  iconOnly?: boolean
  onSuccess?: (updatedFamily: FamilyWithMembers) => void
}

export function EditFamilyDialog({family, areas, groups, iconOnly = false, onSuccess}: EditFamilyDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const areaId = formData.get('areaId') as string
    const groupId = formData.get('groupId') as string

    const result = await updateFamilyAction(family.id, {
      name: capitalizeName(name),
      areaId,
      groupId,
    })

    setIsLoading(false)
    if (result.success && result.data) {
      setOpen(false)
      if (onSuccess) {
        onSuccess(result.data)
      }
      router.refresh()
    } else {
      alert('Lỗi: ' + result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {iconOnly ? (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900/40"
          >
            <Pencil className="h-4 w-4" /> Chỉnh sửa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Gia Đình</DialogTitle>
            <DialogDescription>Cập nhật thông tin hồ sơ gia đình.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={family.name}
                placeholder="Gia đình ông Nguyễn Văn A"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="area" className="text-right">
                Khu vực
              </Label>
              <Select name="areaId" defaultValue={family.areaId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn khu vực/chùa" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.id.toString()}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group" className="text-right">
                Nhóm
              </Label>
              <Select name="groupId" defaultValue={family.groupId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn nhóm/ấp" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95"
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
