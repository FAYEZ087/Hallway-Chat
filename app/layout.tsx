import type { Metadata, Viewport } from 'next'
import { Inter, Space_Mono, DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'

import './globals.css'

const dealingFont = localFont({
  src: './fonts/dealing.otf',
  variable: '--font-dealing',
  display: 'swap',
})

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: 'Hallway - College Video Chat',
  description: 'Meet students who share your vibe. Random video chat exclusively for college students.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#00c896',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dealingFont.variable} ${dmSans.variable} ${_inter.variable} ${_spaceMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}