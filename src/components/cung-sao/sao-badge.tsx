'use client'

import {
    Badge,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui"
import { getStarInfo, hexToRgba } from "@/lib"

interface SaoBadgeProps {
    sao: string
}

export function SaoBadge({ sao }: SaoBadgeProps) {
    const info = getStarInfo(sao);
    const description = info ? `${info.type} - ${info.note}. ${info.description}` : "Không có thông tin chi tiết.";

    if (!info) {
        return <Badge variant="outline">{sao}</Badge>
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-help shadow-sm whitespace-nowrap"
                        style={{
                            backgroundColor: hexToRgba(info.color, 0.1),
                            borderColor: hexToRgba(info.color, 0.3),
                            color: info.color,
                            boxShadow: `0 4px 12px ${hexToRgba(info.color, 0.05)}`
                        }}
                    >
                        <span>{info.icon}</span>
                        <span>{sao}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="glass border-white/20 dark:border-white/10 p-4 max-w-[320px] text-foreground shadow-2xl">
                    <div className="space-y-2">
                        <div className="font-bold flex items-center gap-2 text-base" style={{ color: info.color }}>
                            <span>{info.icon}</span>
                            {sao} ({info.element})
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }}></span>
                            {info.type}
                        </div>
                        <div className="text-sm leading-relaxed pt-2 border-t border-black/5 dark:border-white/10 text-foreground/90">
                            {description}
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
