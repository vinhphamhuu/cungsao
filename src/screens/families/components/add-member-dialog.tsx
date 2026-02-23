'use client'

import {Gender} from '@prisma/client'
import {Check, UserPlus} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

import {createMemberAction} from '@/app/actions'
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
import {capitalizeName} from '@/lib/cung-sao-utils'

export function AddMemberDialog({familyId}: {familyId: string}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [gender, setGender] = useState<Gender>(Gender.MALE)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const fullName = capitalizeName(formData.get('fullName') as string)
    const birthYear = Number(formData.get('birthYear'))
    const gender = formData.get('gender') as Gender
    const isRepresentative = formData.get('isRepresentative') === 'on'

    const result = await createMemberAction({
      fullName,
      birthYear,
      gender,
      familyId,
      isRepresentative,
    })

    setIsLoading(false)
    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      alert('Lỗi: ' + result.error)
    }
  }

  const currentYear = new Date().getFullYear()
  const [birthYear, setBirthYear] = useState<number | ''>(1980)
  const [age, setAge] = useState<number | ''>(currentYear - 1980 + 1)

  const handleBirthYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const by = parseInt(val)
    setBirthYear(val === '' ? '' : by)
    if (by && by > 0) {
      setAge(currentYear - by + 1)
    } else if (val === '') {
      setAge('')
    }
  }

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const a = parseInt(val)
    setAge(val === '' ? '' : a)
    if (a && a > 0) {
      setBirthYear(currentYear - a + 1)
    } else if (val === '') {
      setBirthYear('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:scale-105 active:scale-95">
          <UserPlus className="mr-2 h-4 w-4" /> Thêm Thành Viên
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm Thành Viên</DialogTitle>
            <DialogDescription>Thêm một thành viên mới vào hộ gia đình này.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Họ và tên
              </Label>
              <Input id="fullName" name="fullName" className="col-span-3" required />
            </div>

            <div className="grid grid-cols-4 items-center gap-10">
              <Label className="text-right font-medium whitespace-nowrap pr-4">Năm Sinh / Tuổi AL</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                <div className="relative">
                  <Input
                    id="birthYear"
                    name="birthYear"
                    type="number"
                    min="1900"
                    max={currentYear + 1}
                    value={birthYear}
                    onChange={handleBirthYearChange}
                    className="pr-10 border-blue-200 focus-visible:ring-blue-500"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-blue-500 font-bold pointer-events-none">
                    NĂM
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="150"
                    value={age}
                    onChange={handleAgeChange}
                    className="pr-10 border-pink-200 focus-visible:ring-pink-500"
                    placeholder="Tuổi"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-pink-500 font-bold pointer-events-none">
                    TUỔI
                  </span>
                </div>
              </div>
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
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3 flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="isRepresentative"
                  name="isRepresentative"
                  className="h-4 w-4 w-auto display-inline"
                />
                <Label htmlFor="isRepresentative">Là người đại diện mới</Label>
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
              {isLoading ? 'Đang thêm...' : 'Thêm Thành Viên'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
