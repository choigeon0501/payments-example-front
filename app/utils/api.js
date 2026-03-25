import { API_BASE_URL } from '../constants/api'

let isRefreshing = false
let refreshPromise = null

export async function refreshAccessToken() {
  if (isRefreshing) return refreshPromise

  isRefreshing = true
  const refreshToken = localStorage.getItem('refreshToken')

  refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error('Refresh failed')
      const data = await res.json()
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      return data.accessToken
    })
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  return refreshPromise
}

export async function authenticatedFetch(url, options = {}) {
  const accessToken = localStorage.getItem('accessToken')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  let res = await fetch(`${API_BASE_URL}${url}`, { ...options, headers })

  if (res.status === 401) {
    try {
      const newToken = await refreshAccessToken()
      headers['Authorization'] = `Bearer ${newToken}`
      res = await fetch(`${API_BASE_URL}${url}`, { ...options, headers })
    } catch {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('인증이 만료되었습니다.')
    }
  }

  return res
}
