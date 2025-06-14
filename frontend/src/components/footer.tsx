import { Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-gray-900 p-4 text-sm text-muted-foreground flex justify-between">
      <div className="flex-1/2 text-left p-4">
        &copy; {new Date().getFullYear()} Ecommerce. All rights reserved.
      </div>
      <div className="flex flex-1/2 text-right gap-2 p-4 text-sm justify-end">
        <Link href="https://github.com/Joao-Bonifacio">
          <Github />
        </Link>
        <Link href="https://www.linkedin.com/in/jo%C3%A3o-j%C3%BAnior-7499b6218/">
          <Linkedin />
        </Link>
        <Link href="https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcSKjfzhStJgZQcwXltZnwgFXcwCBXRXqWJjcLGxRxGclMTrWmWZFZZHwtLWnvndJmXgRWqCS">
          <Mail />
        </Link>
      </div>
    </footer>
  )
}
