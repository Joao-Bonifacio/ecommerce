import { ThemeProvider } from '@/components/theme-provider'
import { ReactNode } from 'react'

export default function StoreTemplate({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
