'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Copy, Plus, Trash2 } from "lucide-react"
import { createFamilyWithMembersAction } from "@/app/actions/family-actions"
import { Area, Group, Gender } from "@prisma/client"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DuplicateFamilyDialogProps {
    sourceFamily: {
        id: number
        name: string
        areaId: number
        groupId: number
        members: {
            id: number
            fullName: string
            birthYear: number
            gender: Gender | string // Handle potential string from server action type mismatch if any
        }[] // Simplified member type
    }
    areas: Area[]
    groups: Group[]
    showText?: boolean
}

export function DuplicateFamilyDialog({ sourceFamily, areas, groups, showText }: DuplicateFamilyDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Form state
    const [name, setName] = useState(sourceFamily.name + " (Copy)")
    const [areaId, setAreaId] = useState(sourceFamily.areaId.toString())
    const [groupId, setGroupId] = useState(sourceFamily.groupId.toString())

    // Members state (local copy for editing)
    const [members, setMembers] = useState(sourceFamily.members.map(m => ({
        fullName: m.fullName,
        birthYear: m.birthYear,
        gender: m.gender as "MALE" | "FEMALE"
    })))

    const handleAddMember = () => {
        setMembers([...members, { fullName: "Thành viên mới", birthYear: new Date().getFullYear(), gender: "MALE" }])
    }

    const handleRemoveMember = (index: number) => {
        const newMembers = [...members]
        newMembers.splice(index, 1)
        setMembers(newMembers)
    }

    const handleMemberChange = (index: number, field: keyof typeof members[0], value: any) => {
        const newMembers = [...members]
        // @ts-ignore
        newMembers[index][field] = value
        setMembers(newMembers)
    }

    async function onSubmit() {
        if (!name || !areaId || !groupId) {
            alert("Vui lòng nhập đầy đủ thông tin gia đình.")
            return
        }

        setIsLoading(true)

        const result = await createFamilyWithMembersAction({
            name,
            areaId: parseInt(areaId),
            groupId: parseInt(groupId),
            members
        })

        setIsLoading(false)
        if (result.success && result.data) {
            setOpen(false)
            router.push(`/families/${result.data.id}`)
            router.refresh()
        } else {
            alert("Lỗi: " + (result.error || "Không thể tạo gia đình"))
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={showText ? "outline" : "ghost"} size="sm" title="Nhân bản" className={showText ? "gap-2" : ""}>
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
                                <Label htmlFor="name">Tên Gia Đình</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label>Khu vực</Label>
                                    <Select value={areaId} onValueChange={setAreaId}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {areas.map(a => <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>)}
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
                                            {groups.map(g => <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="font-bold underline">Danh sách thành viên ({members.length})</Label>
                            <Button size="sm" variant="secondary" onClick={handleAddMember} type="button" className="hover:bg-blue-100 hover:text-blue-700 transition-colors">
                                <Plus className="h-3 w-3 mr-1" /> Thêm nhanh
                            </Button>
                        </div>

                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Họ Tên</TableHead>
                                        <TableHead className="w-[20%]">Năm Sinh</TableHead>
                                        <TableHead className="w-[20%]">Giới Tính</TableHead>
                                        <TableHead className="w-[10%]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {members.map((member, idx) => (
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
                                                    onChange={(e) => handleMemberChange(idx, 'birthYear', parseInt(e.target.value))}
                                                    className="h-8"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={member.gender}
                                                    onValueChange={(val) => handleMemberChange(idx, 'gender', val)}
                                                >
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="MALE">Nam</SelectItem>
                                                        <SelectItem value="FEMALE">Nữ</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleRemoveMember(idx)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Huỷ</Button>
                    <Button onClick={onSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95">
                        {isLoading ? "Đang xử lý..." : "Xác nhận & Tạo mới"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
