import {Member} from '@prisma/client'
import {ArrowLeft} from 'lucide-react'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {getAreas, getGroups} from '@/app/actions'
import {Button, Card, CardContent, CardHeader, CardTitle} from '@/components/ui'
import {prisma} from '@/lib'

import {
  AddMemberDialog,
  DuplicateFamilyDialog,
  EditFamilyDialog,
  FamilyPrintButton,
  FamilyQR,
  MemberList,
} from './components'

interface FamilyDetailScreenProps {
  params: Promise<{
    id: string
  }>
}

export async function FamilyDetailScreen({params}: FamilyDetailScreenProps) {
  const {id} = await params

  const family = await prisma.family.findUnique({
    include: {
      area: true,
      group: true,
      members: {
        orderBy: {birthYear: 'asc'},
      },
      representative: true,
    },
    where: {id},
  })

  const areas = await getAreas()
  const groups = await getGroups()

  if (!family) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild size="icon" variant="ghost">
          <Link href="/family">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{family.name}</h1>
          <p className="text-muted-foreground">
            Đại diện:{' '}
            <span className="font-semibold text-foreground">{family.representative?.fullName || 'Chưa có'}</span> •{' '}
            {family.area?.name} • {family.group?.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Cập nhật lần cuối: <span suppressHydrationWarning>{family.updatedAt.toLocaleString('vi-VN')}</span>
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <FamilyPrintButton family={family} />
          <EditFamilyDialog areas={areas} family={family} groups={groups} />
          <DuplicateFamilyDialog areas={areas} groups={groups} showText sourceFamily={family} />
          <FamilyQR familyId={family.id} familyName={family.name} />
        </div>
      </div>

      <Card className="print:hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thành viên trong gia đình</CardTitle>
          <AddMemberDialog familyId={family.id} />
        </CardHeader>
        <CardContent>
          <MemberList members={family.members as Member[]} />
        </CardContent>
      </Card>
    </div>
  )
}
