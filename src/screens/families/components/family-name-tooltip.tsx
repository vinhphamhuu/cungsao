'use client'

import Link from 'next/link'

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui'

interface MemberInfo {
  birthYear: number
  fullName: string
  id: number
}

interface FamilyNameTooltipProps {
  familyId: number
  familyName: string
  members: MemberInfo[]
}

export function FamilyNameTooltip({familyId, familyName, members}: FamilyNameTooltipProps) {
  const currentYear = new Date().getFullYear()

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Link href={`/family/${familyId}`} className="hover:underline text-blue-600 font-medium block">
            {familyName}
          </Link>
        </TooltipTrigger>
        <TooltipContent className="p-4 glass-card border border-white/20" side="top" sideOffset={8}>
          <div className="mb-2 border-b pb-1">
            <p className="font-bold">{familyName}</p>
            <p className="text-xs text-muted-foreground">{members.length} thành viên</p>
          </div>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có thành viên.</p>
          ) : (
            <ul className="space-y-1">
              {members.map((member) => (
                <li key={member.id} className="text-sm whitespace-nowrap">
                  <span className="font-medium">{member.fullName}</span>
                  <span className="text-muted-foreground ml-2" suppressHydrationWarning>
                    - {currentYear - member.birthYear + 1} tuổi
                  </span>
                </li>
              ))}
            </ul>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
