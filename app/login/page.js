'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../components/Header'
import { API_BASE_URL } from '../constants/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || '로그인에 실패했습니다.')
        return
      }

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('email', email)
      router.push('/mypage')
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="Ts32g8 mb-2">로그인</h1>
            <p className="Ts14g5">계정에 로그인하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="Bg2 Ls1g3r12 p-8 space-y-5">
            {error && (
              <div className="bg-[var(--danger)]/10 text-[var(--danger)] text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block Ts12g5 mb-2 font-medium">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl Ls1g3r8 Bg1 Ts14g0 focus:outline-none focus:border-[var(--accent)] transition-colors"
                style={{ borderRadius: 12 }}
              />
            </div>

            <div>
              <label className="block Ts12g5 mb-2 font-medium">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl Ls1g3r8 Bg1 Ts14g0 focus:outline-none focus:border-[var(--accent)] transition-colors"
                style={{ borderRadius: 12 }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>

            <p className="text-center Ts13g5">
              계정이 없으신가요?{' '}
              <Link href="/signup" className="text-[var(--accent)] font-semibold hover:underline">
                회원가입
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  )
}
