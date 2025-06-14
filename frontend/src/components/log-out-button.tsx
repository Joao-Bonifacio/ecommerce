'use client'
import { logout } from '@/api/user'
import { Button } from './ui/button'

export default function LogoutButton() {
  return (
    <Button
      variant="ghost"
      onClick={async () => await logout()}
      className="text-red-400 cursor-pointer"
    >
      Log out
    </Button>
  )
}
