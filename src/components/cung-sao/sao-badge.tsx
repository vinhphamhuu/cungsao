'use client'

import { Badge } from "@/components/ui/badge"
import { getSaoColor, SAO_DESCRIPTIONS } from "@/lib/cung-sao-utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SaoBadgeProps {
    sao: string
}

export function SaoBadge({ sao }: SaoBadgeProps) {
    const description = SAO_DESCRIPTIONS[sao] || "Không có thông tin chi tiết.";

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge variant={getSaoColor(sao) as any} className="font-bold hover:cursor-help">
                        {sao}
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-[300px] text-sm">{description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
