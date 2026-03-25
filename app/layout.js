import './globals.css'
import { ThemeProvider } from './context/ThemeContext'

export const metadata = {
  title: 'PortOne 결제모듈',
  description: 'PortOne 기반 정기구독 결제 시스템',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
