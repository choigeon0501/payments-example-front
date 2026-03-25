'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0f] text-gray-400 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-3">
              Payment<span className="gradient-text">Module</span>
            </h3>
            <p className="text-sm leading-relaxed">
              PortOne 기반 정기구독 결제 시스템
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">서비스</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    홈
                  </Link>
                </li>
                <li>
                  <a
                    href="http://localhost:3000/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    API 문서 (Swagger)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">계정</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/mypage" className="hover:text-white transition-colors">
                    마이페이지
                  </Link>
                </li>
                <li>
                  <Link href="/mypage/subscription" className="hover:text-white transition-colors">
                    구독 관리
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
          © 2025 PaymentModule. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
