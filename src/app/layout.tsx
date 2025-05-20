import { Providers } from '@/components/auth/Providers'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { Inter } from 'next/font/google'
import '../styles/globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const inter = Inter({ subsets: ['latin'] })

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
