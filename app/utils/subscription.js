import { PORTONE_STORE_ID, PORTONE_CHANNEL_KEY } from '../constants/api'
import { authenticatedFetch } from './api'

function generateIssueId() {
  return `issue_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

async function loadPortOneSDK() {
  if (window.PortOne) return window.PortOne

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.portone.io/v2/browser-sdk.js'
    script.onload = () => resolve(window.PortOne)
    script.onerror = () => reject(new Error('PortOne SDK 로드에 실패했습니다.'))
    document.head.appendChild(script)
  })
}

export async function subscribePro(userEmail) {
  const PortOne = await loadPortOneSDK()

  const issueId = generateIssueId()

  const response = await PortOne.requestIssueBillingKey({
    storeId: PORTONE_STORE_ID,
    channelKey: PORTONE_CHANNEL_KEY,
    billingKeyMethod: 'CARD',
    issueId,
    issueName: 'Pro 정기구독',
    customer: {
      email: userEmail,
    },
  })

  if (response.code) {
    throw new Error(response.message || '빌링키 발급에 실패했습니다.')
  }

  const billingKey = response.billingKey

  const res = await authenticatedFetch('/subscriptions', {
    method: 'POST',
    body: JSON.stringify({
      billingKey,
      issueId,
      plan: 'pro',
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || '구독 생성에 실패했습니다.')
  }

  return await res.json()
}
