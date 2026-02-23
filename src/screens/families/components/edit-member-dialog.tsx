'use client'

import {Gender, Member} from '@prisma/client'
import {Check, Pencil} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

import {updateMemberAction} from '@/app/actions'
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
} from '@/components/ui'

interface EditMemberDialogProps {
  member: Member
}

export function EditMemberDialog({member}: EditMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [gender, setGender] = useState<Gender>(member.gender)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const fullName = formData.get('fullName') as string
    const birthYear = Number(formData.get('birthYear'))
    const genderValue = formData.get('gender') as Gender

    const result = await updateMemberAction(member.id, {
      fullName,
      birthYear,
      gender: genderValue,
      familyId: member.familyId,
    })

    setIsLoading(false)
    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      alert('Lỗi: ' + result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Thành Viên</DialogTitle>
            <DialogDescription>Cập nhật thông tin thành viên.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Họ và tên
              </Label>
              <Input id="fullName" name="fullName" defaultValue={member.fullName} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthYear" className="text-right">
                Năm sinh
              </Label>
              <Input
                id="birthYear"
                name="birthYear"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                defaultValue={member.birthYear}
                className="col-span-3"
                required
                suppressHydrationWarning
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Giới tính
              </Label>
              <div className="col-span-3 flex bg-secondary/50 p-1 rounded-lg w-full max-w-[200px]">
                <button
                  type="button"
                  onClick={() => setGender(Gender.MALE)}
                  className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                    gender === Gender.MALE
                      ? 'bg-background text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {gender === Gender.MALE && <Check className="h-3.5 w-3.5" />}
                  Nam
                </button>
                <button
                  type="button"
                  onClick={() => setGender(Gender.FEMALE)}
                  className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                    gender === Gender.FEMALE
                      ? 'bg-background text-pink-600 dark:text-pink-400 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {gender === Gender.FEMALE && <Check className="h-3.5 w-3.5" />}
                  Nữ
                </button>
                <input type="hidden" name="gender" value={gender} />
              </div>
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
              {isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
