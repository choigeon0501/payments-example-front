'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { authenticatedFetch } from '../../../utils/api'

const STATUS_LABEL = {
  succeeded: '완료',
  failed: '실패',
  pending: '처리 중',
  refunded: '환불됨',
}

function formatDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatAmount(amount) {
  if (!amount && amount !== 0) return '-'
  return `₩${amount.toLocaleString()}`
}

export default function PaymentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await authenticatedFetch(`/subscriptions/payments/${params.paymentId}`)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || '결제 정보를 불러올 수 없습니다.')
        }
        setPayment(await res.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [params.paymentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="Ts14g5">불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 animate-fade-in-up">
        <button onClick={() => router.back()} className="Ts14g5 hover:text-[var(--accent)]">
          ← 돌아가기
        </button>
        <div className="Bg2 Ls1g3r12 p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-[var(--danger)]">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="Ts14g5 hover:text-[var(--accent)] transition-colors"
        >
          ← 돌아가기
        </button>
      </div>

      <div>
        <h1 className="Ts24g8 mb-1">결제 상세</h1>
        <p className="Ts13g5 font-mono">{payment.paymentId}</p>
      </div>

      <div className="Bg2 Ls1g3r12 p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-[var(--border)]">
            <span className="Ts14g5">상태</span>
            <span className={`badge badge-${payment.status}`}>
              {STATUS_LABEL[payment.status] || payment.status}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-[var(--border)]">
            <span className="Ts14g5">결제 금액</span>
            <span className="Ts20g8">{formatAmount(payment.amount)}</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-[var(--border)]">
            <span className="Ts14g5">결제일시</span>
            <span className="Ts14g0">{formatDate(payment.paidAt)}</span>
          </div>

          {payment.externalPaymentId && (
            <div className="flex justify-between items-center py-3 border-b border-[var(--border)]">
              <span className="Ts14g5">PortOne 결제 ID</span>
              <span className="Ts13g5 font-mono">{payment.externalPaymentId}</span>
            </div>
          )}

          {payment.subscriptionId && (
            <div className="flex justify-between items-center py-3 border-b border-[var(--border)]">
              <span className="Ts14g5">구독 ID</span>
              <span className="Ts13g5 font-mono">{payment.subscriptionId}</span>
            </div>
          )}

          {payment.receiptUrl && (
            <div className="flex justify-between items-center py-3">
              <span className="Ts14g5">영수증</span>
              <a
                href={payment.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--accent)] font-semibold hover:underline"
              >
                영수증 보기 →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
