import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toast } from '@/components/justd/ui'
import { Providers } from '@/components/providers/providers'
import { Modals } from '@/components/ui/modals'
import { Root } from '@/hooks/use-confirm'
import type { ReactNode } from 'react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return (
    <html lang="ja">
      <head>
        <script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
          async={true}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toast />
          <Root />
          <Modals />
          {children}
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
