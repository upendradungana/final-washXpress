import { Providers } from '@/components/auth/Providers'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { Inter } from 'next/font/google'
import '../styles/globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Metadata } from 'next'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: 'WashXpress',
  description: 'Premium car washing services for individuals and fleets',
  icons: {
    icon: '/favIcon/washXpressFavicon.png',
    shortcut: '/favIcon/washXpressFavicon.png',
    apple: '/favIcon/washXpressFavicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        <Providers>
          <header className="flex justify-between items-center p-4">
            <Navbar />
          </header>
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
