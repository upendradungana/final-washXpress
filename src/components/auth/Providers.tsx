'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import {ThemeProviderProps } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      <SessionProvider>
        {children}
      </SessionProvider>
    </NextThemesProvider>
  )
}