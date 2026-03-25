'use client'

import { useState } from 'react'
import { useUser } from '../../context/UserContext'
import { authenticatedFetch } from '../../utils/api'
import { subscribePro } from '../../utils/subscription'
import PlanCards from '../../components/PlanCards'

export default function SubscriptionPage() {
  const { subscription, refreshSubscription } = useUser()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleCancel = async () => {
    if (!confirm('구독을 취소하시겠습니까? 현재 기간이 끝나면 Free로 전환됩니다.')) return
    setLoading(true)
    setMessage(null)
    try {
      const res = await authenticatedFetch('/subscriptions', { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || '구독 취소에 실패했습니다.')
      }
      setMessage({ type: 'success', text: '구독이 취소되었습니다.' })
      await refreshSubscription()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleResume = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await authenticatedFetch('/subscriptions/resume', { method: 'PATCH' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || '구독 재개에 실패했습니다.')
      }
      setMessage({ type: 'success', text: '구독이 재개되었습니다.' })
      await refreshSubscription()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    setLoading(true)
    setMessage(null)
    try {
      await subscribePro(localStorage.getItem('email') || '')
      setMessage({ type: 'success', text: 'Pro 구독이 시작되었습니다!' })
      await refreshSubscription()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const statusLabel = {
    active: '활성',
    canceled: '취소됨',
    failed: '실패',
    expired: '만료',
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="Ts24g8 mb-1">구독 관리</h1>
        <p className="Ts14g5">플랜 및 구독 상태를 관리하세요</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-[var(--success)]/10 text-[var(--success)]'
              : 'bg-[var(--danger)]/10 text-[var(--danger)]'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Current Subscription */}
      {subscription ? (
        <div className="Bg2 Ls1g3r12 p-6">
          <h2 className="Ts16g8 mb-5">현재 구독</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="Ts14g5">플랜</span>
              <span className="Ts16g8 gradient-text">{subscription.plan?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="Ts14g5">상태</span>
              <span className={`badge badge-${subscription.status}`}>
                {statusLabel[subscription.status] || subscription.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="Ts14g5">구독 만료일</span>
              <span className="Ts14g0">
                {subscription.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString('ko')
                  : '-'}
              </span>
            </div>
            {subscription.billingKeyId && (
              <div className="flex justify-between items-center">
                <span className="Ts14g5">빌링키</span>
                <span className="Ts13g5 font-mono">{subscription.billingKeyId}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-[var(--border)] flex gap-3">
            {subscription.status === 'active' && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--danger)] border border-[var(--danger)]/30 hover:bg-[var(--danger)]/10 transition-colors disabled:opacity-50"
              >
                {loading ? '처리 중...' : '구독 취소'}
              </button>
            )}
            {subscription.status === 'canceled' && (
              <button
                onClick={handleResume}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--success)] hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {loading ? '처리 중...' : '구독 재개'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="Bg2 Ls1g3r12 p-8 text-center">
          <div className="text-4xl mb-4">💎</div>
          <h2 className="Ts20g8 mb-2">구독 중인 플랜이 없습니다</h2>
          <p className="Ts14g5 mb-6">Pro 플랜을 구독하고 모든 기능을 이용하세요</p>
        </div>
      )}

      {/* Plan Cards */}
      <div>
        <h2 className="Ts16g8 mb-4">플랜 비교</h2>
        <PlanCards onSubscribePro={handleSubscribe} />
      </div>
    </div>
  )
}
