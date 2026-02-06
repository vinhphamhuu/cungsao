import { getAllMembers } from "@/app/actions/member-actions"
import { getAreas, getGroups } from "@/app/actions/lookup-actions"
import { CungSaoTable } from "@/components/cung-sao/cung-sao-table"

export default async function CungSaoPage() {
    const members = await getAllMembers()
    const areas = await getAreas()
    const groups = await getGroups()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Danh sách Cúng Sao</h1>
                <p className="text-muted-foreground">Tổng hợp tất cả thành viên và sao hạn năm nay.</p>
            </div>

            <CungSaoTable initMembers={members} areas={areas} groups={groups} />
        </div>
    )
}
