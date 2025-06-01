import Header from '@/components/header'
import { CartProvider } from '@/context/cart-context'
import { ReactNode } from 'react'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="grid h-screen w-full grid-rows-app gap-10">
        <Header />
        <main>{children}</main>
      </div>
    </CartProvider>
  )
}
