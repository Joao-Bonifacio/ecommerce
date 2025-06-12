import { getCurrentUser } from '@/app/api/user'
import { Pencil } from 'lucide-react'
import Image from 'next/image'

export default async function SettingsPage() {
  const { nickname, avatar } = await getCurrentUser()

  return (
    <>
      <div className="m-4! text-right bg-blue-950 p-4! rounded-md mb-10!">
        <button className="bg-green-400! p-2! rounded-md! text-gray-800! text-right">
          Upgrade plan
        </button>
      </div>

      <div className="w-[1200px]! sm:w-[600px]! mx-auto! text-center bg-blue-950 rounded-md p-5!">
        {/* modal -> send image */}
        <div className="mx-auto! rounded-full w-30 h-30 bg-background flex items-center justify-center relative">
          <Image
            className="rounded-full"
            src={avatar ? avatar : '/image/avatar-placeholder.png'}
            alt="avatar"
            width={160}
            height={160}
          />
          <div className="absolute bottom-0 right-0 bg-gray-400 p-1! rounded-full cursor-pointer">
            <Pencil />
          </div>
        </div>

        <div className="my-4!" />
        <h1 className="text-2xl! font-bold mb-4!">{nickname}</h1>
        <form>
          <input
            type="password"
            placeholder="Current Password"
            className="my-2! w-[80%] p-2! px-4! bg-zinc-600! rounded-md! placeholder:text-white!"
          />
          <input
            type="password"
            placeholder="New Password"
            className="my-2! w-[80%] p-2! px-4! bg-zinc-600! rounded-md! placeholder:text-white!"
          />
        </form>
        <div className="my-4!" />

        <div className="flex! justify-between p-5!">
          <button className="bg-red-500! text-white p-2! rounded-md! cursor-pointer">
            Delete Account
          </button>
          <button className="bg-blue-500! text-white p-2! rounded-md! cursor-pointer">
            Save Password
          </button>
        </div>
      </div>
    </>
  )
}
