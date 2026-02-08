'use client'

import {Trash2} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

import {deleteFamilyAction} from '@/app/actions'
import {Button} from '@/components/ui'

interface FamilyDeleteButtonProps {
  familyId: string
  familyName: string
  iconOnly?: boolean
  onSuccess?: () => void
  redirect?: boolean
}

export function FamilyDeleteButton({
  familyId,
  familyName,
  redirect = true,
  onSuccess,
  iconOnly = false,
}: FamilyDeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm(`Bạn có chắc chắn muốn xóa gia đình "${familyName}" và TẤT CẢ thành viên không?`)) {
      setIsLoading(true)
      const result = await deleteFamilyAction(familyId)

      if (result.success) {
        if (redirect) {
          router.push('/')
        }
        router.refresh()
        if (onSuccess) {
          onSuccess()
        }
      } else {
        alert(result.error || 'Có lỗi xảy ra khi xóa gia đình')
        setIsLoading(false)
      }
    }
  }

  if (iconOnly) {
    return (
      <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isLoading} title="Xóa gia đình">
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    )
  }

  return (
    <Button variant="destructive" size="sm" className="gap-2" onClick={handleDelete} disabled={isLoading}>
      <Trash2 className="h-4 w-4" />
      {isLoading ? 'Đang xóa...' : 'Xóa'}
    </Button>
  )
}
