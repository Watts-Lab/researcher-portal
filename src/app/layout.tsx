import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from './AuthProvider'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CSSLab Researcher Portal',
  description: 'CSSLab Researcher Portal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="cupcake">
      {/* <body className={inter.className}> */}
      <body className="h-screen flex flex-col">
        <SessionProvider>
          {/* <Navbar /> */}
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
