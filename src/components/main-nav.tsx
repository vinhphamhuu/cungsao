import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export function MainNav() {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4 container mx-auto">
                <div className="font-bold text-xl mr-8">Cúng Sao</div>
                <nav className="flex items-center space-x-4 lg:space-x-6">
                    <Link
                        href="/"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Trang chủ
                    </Link>
                    <Link
                        href="/families"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Gia Đình
                    </Link>
                    <Link
                        href="/cung-sao"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Danh sách Cúng Sao
                    </Link>
                </nav>
                <div className="ml-auto flex items-center space-x-4">
                    <ModeToggle />
                </div>
            </div>
        </div>
    )
}
