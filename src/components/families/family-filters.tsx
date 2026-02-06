'use client'

import { Input } from "@/components/ui/input"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, Group } from "@prisma/client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FamilyFiltersProps {
    areas: Area[]
    groups: Group[]
}

export function FamilyFilters({ areas, groups }: FamilyFiltersProps) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    // Local state for immediate feedback
    const [areaId, setAreaId] = useState(searchParams.get('areaId') || "")
    const [groupId, setGroupId] = useState(searchParams.get('groupId') || "")

    const handleSearch = useDebouncedCallback((term: string) => {
        updateParams('query', term)
    }, 300)

    const updateParams = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams)
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const handleAreaChange = (val: string) => {
        setAreaId(val)
        updateParams('areaId', val === "ALL" ? null : val)
    }

    const handleGroupChange = (val: string) => {
        setGroupId(val)
        updateParams('groupId', val === "ALL" ? null : val)
    }

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams)
        params.delete('areaId')
        params.delete('groupId')
        params.delete('query')
        setAreaId("")
        setGroupId("")
        // Also need to clear input value visually if possible, but input is uncontrolled mostly
        replace(`${pathname}`)
    }

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[300px]">
                <Input
                    placeholder="Tìm kiếm gia đình..."
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('query')?.toString()}
                />
            </div>

            <Select value={areaId} onValueChange={handleAreaChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn Khu vực" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">Tất cả Khu vực</SelectItem>
                    {areas.map(area => (
                        <SelectItem key={area.id} value={area.id.toString()}>{area.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={groupId} onValueChange={handleGroupChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn Nhóm" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">Tất cả Nhóm</SelectItem>
                    {groups.map(group => (
                        <SelectItem key={group.id} value={group.id.toString()}>{group.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {(areaId || groupId || searchParams.get('query')) && (
                <Button variant="ghost" size="icon" onClick={clearFilters} title="Xoá bộ lọc">
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}
