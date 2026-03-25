'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from './components/Header'
import Footer from './components/Footer'
import PlanCards from './components/PlanCards'
import { subscribePro } from './utils/subscription'

export default function HomePage() {
  const router = useRouter()
  const sectionsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
            entry.target.style.opacity = '1'
          }
        })
      },
      { threshold: 0.1 }
    )
    sectionsRef.current.forEach((el) => {
      if (el) {
        el.style.opacity = '0'
        observer.observe(el)
      }
    })
    return () => observer.disconnect()
  }, [])

  const handleSubscribe = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      return
    }
    try {
      await subscribePro(localStorage.getItem('email') || '')
      alert('Pro 구독이 시작되었습니다!')
      router.push('/mypage/subscription')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 30% 20%, rgba(108,92,231,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0,184,148,0.1) 0%, transparent 50%)',
            }}
          />
          <div className="relative text-center px-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              간편한
              <br />
              <span className="gradient-text">정기구독 결제</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed">
              PortOne 기반 빌링키 결제로 구독 생성부터 자동 갱신, 취소, 재개까지
              <br />
              결제의 모든 생명주기를 하나의 모듈로 관리하세요.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/signup')}
                className="px-8 py-4 rounded-2xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-all hover:scale-105 shadow-lg shadow-[var(--accent)]/25"
              >
                무료로 시작하기
              </button>
              <a
                href="http://localhost:3000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl font-semibold Ls1g3r12 hover:bg-[var(--bg-secondary)] transition-all"
              >
                API 문서
              </a>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16" ref={(el) => (sectionsRef.current[0] = el)}>
              <h2 className="Ts32g8 mb-4">어떻게 동작하나요?</h2>
              <p className="Ts16g8 text-[var(--text-secondary)] font-normal">
                3단계로 정기구독 결제를 완성하세요
              </p>
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              ref={(el) => (sectionsRef.current[1] = el)}
            >
              {[
                {
                  step: '01',
                  title: '빌링키 발급',
                  desc: 'PortOne SDK로 카드 정보를 입력받고 빌링키를 발급받습니다.',
                  icon: '💳',
                },
                {
                  step: '02',
                  title: '구독 생성',
                  desc: '빌링키로 첫 결제를 실행하고 구독을 시작합니다.',
                  icon: '🔄',
                },
                {
                  step: '03',
                  title: '자동 갱신',
                  desc: '웹훅으로 결제를 자동 처리하고 구독이 갱신됩니다.',
                  icon: '✅',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="Bg2 Ls1g3r12 p-8 text-center hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-[var(--accent)] text-sm font-bold mb-2">
                    STEP {item.step}
                  </div>
                  <h3 className="Ts20g8 mb-3">{item.title}</h3>
                  <p className="Ts14g5 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="py-24 px-6 Bg1">
          <div className="max-w-4xl mx-auto" ref={(el) => (sectionsRef.current[2] = el)}>
            <div className="text-center mb-12">
              <h2 className="Ts32g8 mb-4">플랜 & 가격</h2>
              <p className="Ts14g5">프로젝트에 맞는 플랜을 선택하세요</p>
            </div>
            <PlanCards onSubscribePro={handleSubscribe} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
