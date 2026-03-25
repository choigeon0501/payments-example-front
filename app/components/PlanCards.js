'use client'

export default function PlanCards({ onSubscribePro }) {
  const plans = [
    {
      name: 'Free',
      price: '무료',
      description: '기본 플랜',
      features: ['기본 기능 이용'],
      badge: null,
      action: null,
    },
    {
      name: 'Pro',
      price: '₩9,900',
      period: '/월',
      description: '프로 플랜',
      features: ['모든 기능 이용', '우선 지원', '고급 분석'],
      badge: '인기',
      action: onSubscribePro,
      actionLabel: 'Pro 구독하기',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: '협의',
      description: '엔터프라이즈',
      features: ['맞춤 기능', '전담 지원', 'SLA 보장'],
      badge: '준비 중',
      action: null,
      actionLabel: '문의하기',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative rounded-2xl p-6 transition-all duration-300 ${
            plan.highlight
              ? 'bg-gradient-to-br from-[var(--accent)]/10 to-[var(--success)]/10 border-2 border-[var(--accent)]/30 shadow-lg scale-[1.02]'
              : 'Bg2 Ls1g3r12 hover:shadow-md'
          }`}
        >
          {plan.badge && (
            <span
              className={`absolute -top-3 right-4 text-xs font-bold px-3 py-1 rounded-full text-white ${
                plan.badge === '인기' ? 'bg-[var(--accent)]' : 'bg-gray-500'
              }`}
            >
              {plan.badge}
            </span>
          )}
          <h3 className="Ts20g8 mb-1">{plan.name}</h3>
          <p className="Ts13g5 mb-4">{plan.description}</p>
          <div className="mb-6">
            <span className="Ts32g8">{plan.price}</span>
            {plan.period && <span className="Ts14g5">{plan.period}</span>}
          </div>
          <ul className="space-y-2 mb-6">
            {plan.features.map((f) => (
              <li key={f} className="Ts14g0 flex items-center gap-2">
                <span className="text-[var(--success)]">✓</span> {f}
              </li>
            ))}
          </ul>
          {plan.action && (
            <button
              onClick={plan.action}
              className="w-full py-3 rounded-xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors"
            >
              {plan.actionLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
