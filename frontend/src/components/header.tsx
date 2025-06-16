import Image from 'next/image'
import Link from 'next/link'
import CartWidget from './cart-widget'
import SearchForm from './search-form'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { ThemeToggle } from './theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LogoutButton from './log-out-button'
import { Bell } from 'lucide-react'

export default async function Header() {
  const token = (await cookies()).get('access_token')

  return (
    <header className="flex items-center justify-between !p-4">
      <div className="flex items-center gap-5">
        <Link href="/" className="text-2xl font-extrabold text-white">
          Ecommerce
        </Link>

        <Suspense fallback={null}>
          <SearchForm />
        </Suspense>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/cart">
          <CartWidget />
        </Link>

        <div className="w-px h-4 bg-zinc-700" />
        <ThemeToggle />

        {token ? (
          <>
            <Bell className="w-4.5 cursor-pointer" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2 hover:underline cursor-pointer">
                  <span className="text-md">Account</span>
                  <Image
                    src="https://i.pravatar.cc/101"
                    className="h-7 w-7 rounded-full"
                    width={24}
                    height={24}
                    alt="avatar"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link href="/settings">Profile Settings</Link>
                    <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/seller">Seller Pannel</Link>
                    <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogoutButton />
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex gap-4">
            <Link
              href="/sign-up"
              className="bg-gray-800 text-white cursor-pointer p-2 rounded-md"
            >
              Sign-up
            </Link>
            <Link
              href="/sign-in"
              className="bg-blue-800 text-white cursor-pointer p-2 rounded-md"
            >
              Sign-in
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
