'use client'

import { QRCodeSVG } from 'qrcode.react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import { QrCode } from 'lucide-react'
import { useEffect, useState } from 'react'

interface FamilyQRProps {
  familyId: number
  familyName: string
}

export function FamilyQR({ familyId, familyName }: FamilyQRProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const url = `${window.location.origin}/families/${familyId}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <QrCode className="h-4 w-4" />
          Mã QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Mã QR cho gia đình {familyName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG value={url} size={200} />
          </div>
          <p className="text-sm text-center text-muted-foreground break-all">{url}</p>
          <p className="text-sm text-center text-muted-foreground">
            Quét mã để xem danh sách thành viên
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
