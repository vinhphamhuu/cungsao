'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useDebouncedCallback} from 'use-debounce'

import {Input} from '@/components/ui'

export function FamilySearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const {replace} = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="w-full max-w-sm">
      <Input
        placeholder="Tìm kiếm gia đình hoặc người đại diện..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  )
}
