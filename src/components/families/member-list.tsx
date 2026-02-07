'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Member } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { getSaoColor, calculateSao } from "@/lib/cung-sao-utils"
import { deleteMemberAction, updateMemberAction } from "@/app/actions/member-actions"
import { Trash2, UserCog } from "lucide-react"
import { useRouter } from "next/navigation"
import { EditMemberDialog } from "./edit-member-dialog"
import { SaoBadge } from "@/components/cung-sao/sao-badge"

// We can move calculateSao to client or server. Since it's pure util, client is fine.

interface MemberListProps {
    members: Member[]
    familyId: number
}

export function MemberList({ members, familyId }: MemberListProps) {
    const currentYear = new Date().getFullYear()
    const router = useRouter()

    const handleDelete = async (id: number) => {
        if (confirm("Bạn có chắc muốn xoá thành viên này?")) {
            await deleteMemberAction(id)
            router.refresh()
        }
    }

    return (
        <div className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Họ Tên</TableHead>
                        <TableHead>Năm Sinh</TableHead>
                        <TableHead>Tuổi (AL)</TableHead>
                        <TableHead>Giới Tính</TableHead>
                        <TableHead>Sao</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Chưa có thành viên nào.</TableCell>
                        </TableRow>
                    ) : members.map((member) => {
                        const age = currentYear - member.birthYear + 1
                        const sao = calculateSao(member.birthYear, member.gender, currentYear)

                        return (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.fullName}</TableCell>
                                <TableCell>{member.birthYear}</TableCell>
                                <TableCell>{age}</TableCell>
                                <TableCell>{member.gender === 'MALE' ? 'Nam' : 'Nữ'}</TableCell>
                                <TableCell>
                                    <SaoBadge sao={sao} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <EditMemberDialog member={member} />
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(member.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
