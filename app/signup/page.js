'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../components/Header'
import { API_BASE_URL } from '../constants/api'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || '회원가입에 실패했습니다.')
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
            <h1 className="Ts32g8 mb-2">회원가입</h1>
            <p className="Ts14g5">새 계정을 만드세요</p>
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

            <div>
              <label className="block Ts12g5 mb-2 font-medium">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
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
              {loading ? '가입 중...' : '회원가입'}
            </button>

            <p className="text-center Ts13g5">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-[var(--accent)] font-semibold hover:underline">
                로그인
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  )
}
