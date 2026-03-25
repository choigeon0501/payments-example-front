'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'
import { authenticatedFetch } from '../utils/api'

export default function DashboardPage() {
  const router = useRouter()
  const { user, subscription, loading, refreshSubscription } = useUser()

  const handleLogout = async () => {
    try {
      await authenticatedFetch('/auth/logout', { method: 'POST' })
    } catch {}
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('email')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="Ts14g5">불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="Ts24g8 mb-1">대시보드</h1>
        <p className="Ts14g5">계정 및 구독 현황을 확인하세요</p>
      </div>

      {/* Account Info */}
      <div className="Bg2 Ls1g3r12 p-6">
        <h2 className="Ts16g8 mb-4">계정 정보</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="Ts14g5">이메일</span>
            <span className="Ts14g0 font-medium">{user?.email || (typeof window !== 'undefined' ? localStorage.getItem('email') : '') || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="Ts14g5">플랜</span>
            <span className="Ts14g0 font-medium gradient-text">
              {subscription?.plan?.toUpperCase() || 'FREE'}
            </span>
          </div>
        </div>
      </div>

      {/* Subscription Overview */}
      <div className="Bg2 Ls1g3r12 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="Ts16g8">구독 현황</h2>
          <button
            onClick={refreshSubscription}
            className="Ts12g5 hover:text-[var(--accent)] transition-colors"
          >
            새로고침
          </button>
        </div>

        {subscription ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="Ts14g5">상태</span>
              <span className={`badge badge-${subscription.status}`}>
                {subscription.status}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="Ts14g5">구독 만료일</span>
              <span className="Ts14g0">
                {subscription.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString('ko')
                  : '-'}
              </span>
            </div>
            <div className="pt-2">
              <button
                onClick={() => router.push('/mypage/subscription')}
                className="text-sm text-[var(--accent)] font-semibold hover:underline"
              >
                구독 관리 →
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="Ts14g5 mb-4">활성 구독이 없습니다</p>
            <button
              onClick={() => router.push('/mypage/subscription')}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors"
            >
              구독 시작하기
            </button>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => router.push('/mypage/payments')}
          className="Bg2 Ls1g3r12 p-6 text-left hover:shadow-md transition-all group"
        >
          <div className="text-2xl mb-2">💳</div>
          <div className="Ts16g8 group-hover:text-[var(--accent)] transition-colors">결제 내역</div>
          <div className="Ts13g5 mt-1">결제 목록 및 상세 조회</div>
        </button>
        <a
          href="http://localhost:3000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="Bg2 Ls1g3r12 p-6 text-left hover:shadow-md transition-all group"
        >
          <div className="text-2xl mb-2">📄</div>
          <div className="Ts16g8 group-hover:text-[var(--accent)] transition-colors">API 문서</div>
          <div className="Ts13g5 mt-1">Swagger API 문서 보기</div>
        </a>
      </div>

      {/* Logout */}
      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="text-sm text-[var(--danger)] hover:underline"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
