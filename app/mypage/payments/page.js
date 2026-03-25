'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { authenticatedFetch } from '../../utils/api'

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
  })
}

function formatAmount(amount) {
  if (!amount && amount !== 0) return '-'
  return `₩${amount.toLocaleString()}`
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const size = 20

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authenticatedFetch(`/subscriptions/payments?page=${page}&size=${size}`)
      if (res.ok) {
        const data = await res.json()
        setPayments(data.items || [])
        setTotalPages(data.totalCount ? Math.ceil(data.totalCount / size) : 1)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="Ts24g8 mb-1">결제 내역</h1>
        <p className="Ts14g5">구독 결제 기록을 확인하세요</p>
      </div>

      <div className="Bg2 Ls1g3r12 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center Ts14g5">불러오는 중...</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <p className="Ts14g5">결제 내역이 없습니다</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-[var(--border)] Ts12g5 font-semibold">
              <div>결제일</div>
              <div>결제 ID</div>
              <div className="text-right">금액</div>
              <div className="text-right">상태</div>
            </div>

            {/* Table Body */}
            {payments.map((payment) => (
              <Link
                key={payment.paymentId}
                href={`/mypage/payments/${payment.paymentId}`}
                className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="Ts14g0">
                  {formatDate(payment.paidAt)}
                </div>
                <div className="Ts13g5 font-mono truncate">{payment.paymentId}</div>
                <div className="Ts14g0 font-semibold text-right">
                  {formatAmount(payment.amount)}
                </div>
                <div className="text-right">
                  <span className={`badge badge-${payment.status}`}>
                    {STATUS_LABEL[payment.status] || payment.status}
                  </span>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg Ts14g0 Ls1g3r8 hover:bg-[var(--bg-secondary)] disabled:opacity-30 transition-colors"
          >
            이전
          </button>
          <span className="Ts14g5 px-4">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg Ts14g0 Ls1g3r8 hover:bg-[var(--bg-secondary)] disabled:opacity-30 transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}
