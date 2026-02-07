import {prisma} from '@/lib'
import {notFound} from 'next/navigation'
import {Button, Card, CardContent, CardHeader, CardTitle} from '@/components/ui'
import Link from 'next/link'
import {ArrowLeft} from 'lucide-react'
import {AddMemberDialog, DuplicateFamilyDialog, FamilyQR, MemberList} from '@/components/families'
import {getAreas, getGroups} from '@/app/actions'

interface FamilyDetailPageProps {
  params: {
    id: string
  }
}

export default async function FamilyDetailPage({params}: FamilyDetailPageProps) {
  // Await params in newer Next.js versions if needed, but here standard
  // Wait, Next.js 15+ Params are async. Next 14 they are likely sync but accessible directly.
  // Next 16 seems to be used (from package.json).
  // So params is a Promise in Next 15+.
  const {id} = await params // Await it to be safe or check version rules.

  const familyId = parseInt(id)
  if (isNaN(familyId)) notFound()

  const family = await prisma.family.findUnique({
    where: {id: familyId},
    include: {
      group: true,
      area: true,
      representative: true,
      members: {
        orderBy: {birthYear: 'asc'},
      },
    },
  })

  const areas = await getAreas()
  const groups = await getGroups()

  if (!family) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/families">
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
          <p className="text-xs text-muted-foreground">Cập nhật lần cuối: {family.updatedAt.toLocaleString('vi-VN')}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DuplicateFamilyDialog sourceFamily={family} areas={areas} groups={groups} showText />
          <FamilyQR familyId={family.id} familyName={family.name} />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thành viên trong gia đình</CardTitle>
          <AddMemberDialog familyId={family.id} />
        </CardHeader>
        <CardContent>
          <MemberList members={family.members} />
        </CardContent>
      </Card>
    </div>
  )
}
