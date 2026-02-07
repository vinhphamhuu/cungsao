import Link from 'next/link'

import {ModeToggle} from '@/components/mode-toggle'

export function MainNav() {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
      <div className="glass flex h-14 items-center px-6 rounded-2xl shadow-2xl max-w-5xl w-[95%] border border-white/20">
        <div className="font-bold text-xl mr-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cúng Sao
        </div>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-sm font-semibold transition-all hover:scale-105 active:scale-95">
            Trang chủ
          </Link>
          <Link
            href="/families"
            className="text-sm font-semibold text-muted-foreground transition-all hover:scale-105 active:scale-95 hover:text-foreground"
          >
            Gia Đình
          </Link>
          <Link
            href="/cung-sao"
            className="text-sm font-semibold text-muted-foreground transition-all hover:scale-105 active:scale-95 hover:text-foreground"
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
