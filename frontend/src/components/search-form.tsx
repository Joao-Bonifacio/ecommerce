'use client'
import { Search, Send } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent } from 'react'

export default function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)
    const query = data.q

    if (!query) return null

    router.push(`/search?q=${query}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-[300px] items-center gap-3 rounded-full bg-zinc-500 px-5 py-3 ring-zinc-700 !p-2"
    >
      <Search className="w-5 h-5 text-zinc-700" />

      <input
        type="text"
        name="q"
        defaultValue={query ?? ''}
        placeholder="Search product..."
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-700"
        required
      />
      <button type="submit" className="!px-1.5 cursor-pointer">
        <Send className="w-5 h-5 text-zinc-700" />
      </button>
    </form>
  )
}
