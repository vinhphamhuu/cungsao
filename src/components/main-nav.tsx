'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {ModeToggle} from '@/components/mode-toggle'
import {cn} from '@/lib/utils'

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    {href: '/', label: 'Trang chủ'},
    {href: '/family', label: 'Gia Đình'},
    {href: '/stars', label: 'Danh sách Cúng Sao'},
  ]

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
      <div className="glass flex h-14 items-center px-6 rounded-2xl shadow-2xl max-w-5xl w-[95%] border border-white/20">
        <div className="font-bold text-xl mr-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cúng Sao
        </div>
        <nav className="flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-semibold transition-all hover:scale-105 active:scale-95',
                  isActive ? 'text-blue-600' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
