'use client'
import { useSearchParams } from 'next/navigation'

export default function CurrentSearch() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return (
    <p className="text-lg !p-2">
      Results for: <span className="font-semibold">{query}</span>
    </p>
  )
}
