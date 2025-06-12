import { getCurrentUser, updateAvatar, updatePassword } from '@/app/api/user'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
import { ButtonDeleteAccount } from '../../../../components/button-delete-account'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default async function SettingsPage() {
  const { nickname, avatar, level } = await getCurrentUser()

  return (
    <>
      {level !== 'PLATINUM' && (
        <div className="m-4! text-right bg-blue-950 p-4! rounded-md mb-10!">
          <button className="bg-green-400! p-2! rounded-md! text-gray-800! text-right">
            Upgrade plan
          </button>
        </div>
      )}

      <div className="w-[1200px]! sm:w-[600px]! mx-auto! text-center bg-blue-950 rounded-md p-5!">
        <Dialog>
          <form
            action={async (data: FormData) => {
              'use server'
              await updateAvatar(
                data.get('fileName') as string,
                data.get('file') as File,
              )
            }}
          >
            <DialogTrigger asChild>
              <div className="mx-auto! rounded-full w-30 h-30 bg-background flex items-center justify-center relative cursor-pointer">
                <Image
                  className="rounded-full"
                  src={avatar || '/image/avatar-placeholder.png'}
                  alt="avatar"
                  width={160}
                  height={160}
                />
                <div className="absolute bottom-0 right-0 bg-gray-400 p-1! rounded-full cursor-pointer">
                  <Pencil />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]! p-6!">
              <DialogHeader>
                <DialogTitle className="mb-3!">Edit avatar</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">File name</Label>
                  <Input
                    id="fileName"
                    name="fileName"
                    defaultValue="avatar"
                    className="bg-zinc-600! rounded-md! px-3!"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    className="bg-zinc-600! rounded-md! cursor-pointer! p-1! px-3!"
                  />
                </div>
              </div>
              <DialogFooter className="justify-between!">
                <DialogClose asChild>
                  <Button variant="outline" className="cursor-pointer!">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-green-700! p-1! rounded-md! cursor-pointer! px-2!"
                >
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        <form
          action={async (data: FormData) => {
            'use server'
            await updatePassword(data)
          }}
        >
          <div className="my-4!" />
          <h1 className="text-2xl! font-bold mb-4!">{nickname}</h1>
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
          <div className="my-4!" />

          <div className="flex! justify-between p-5!">
            <ButtonDeleteAccount />
            <button
              type="submit"
              className="bg-blue-500! text-white p-2! rounded-md! cursor-pointer"
            >
              Save Password
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
