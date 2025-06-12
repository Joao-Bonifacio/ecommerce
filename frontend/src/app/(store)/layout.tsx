import Header from '@/components/header'
import { CartProvider } from '@/context/cart-context'
import { ReactNode } from 'react'
// import { useUserStore } from '@/context/stores/user-store'

export default function StoreLayout({ children }: { children: ReactNode }) {
  // const user = useUserStore((state) => state.user)
  // console.log(user)

  return (
    <CartProvider>
      <div className="h-screen w-full">
        <Header />
        <main>{children}</main>
      </div>
    </CartProvider>
  )
}
