import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'modern-css-reset/dist/reset.min.css'

// Material-ui
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Header from '../components/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'サーバー監視効率化',
  description: 'サーバー監視効率化用のアプリケーションです。',
  robots: 'noindex',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
