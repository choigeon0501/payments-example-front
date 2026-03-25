'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Header from '../components/Header'
import { UserProvider, useUser } from '../context/UserContext'

function Sidebar() {
  const pathname = usePathname()
  const { subscription } = useUser()

  const links = [
    { href: '/mypage', label: '대시보드', icon: '📊' },
    { href: '/mypage/subscription', label: '구독 관리', icon: '💎' },
    { href: '/mypage/payments', label: '결제 내역', icon: '💳' },
  ]

  const statusLabel = {
    active: 'Active',
    canceled: 'Canceled',
    failed: 'Failed',
    expired: 'Expired',
  }

  return (
    <aside className="w-64 shrink-0 Bg2 Ls1g3r12 p-6 h-fit sticky top-24">
      {/* Plan badge */}
      <div className="mb-6 pb-6 border-b border-[var(--border)]">
        <div className="Ts12g5 mb-1">현재 플랜</div>
        <div className="flex items-center gap-2">
          <span className="Ts20g8 gradient-text">
            {subscription?.plan?.toUpperCase() || 'FREE'}
          </span>
          {subscription?.status && (
            <span className={`badge badge-${subscription.status}`}>
              {statusLabel[subscription.status] || subscription.status}
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/mypage' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

function MypageContent({ children }) {
  const router = useRouter()
  const { ensureUser } = useUser()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.replace('/login')
      return
    }
    ensureUser().then(() => setAuthorized(true))
  }, [])

  if (!authorized) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="Ts14g5">인증 확인 중...</div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="flex-1 pt-20 px-6 pb-12">
        <div className="max-w-6xl mx-auto flex gap-8">
          <Sidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </>
  )
}

export default function MypageLayout({ children }) {
  return (
    <UserProvider>
      <MypageContent>{children}</MypageContent>
    </UserProvider>
  )
}
