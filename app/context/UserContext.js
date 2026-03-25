'use client'

import { createContext, useContext, useState, useRef, useCallback } from 'react'
import { authenticatedFetch } from '../utils/api'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fetchedRef = useRef(false)
  const fetchPromiseRef = useRef(null)

  const fetchUser = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const subRes = await authenticatedFetch('/subscriptions')
      const subData = subRes.ok ? await subRes.json() : null
      setSubscription(subData)
      setUser({ email: localStorage.getItem('email') })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const ensureUser = useCallback(async () => {
    if (fetchedRef.current) return
    if (fetchPromiseRef.current) return fetchPromiseRef.current

    fetchedRef.current = true
    fetchPromiseRef.current = fetchUser()
    return fetchPromiseRef.current
  }, [fetchUser])

  const refreshSubscription = useCallback(async () => {
    try {
      const res = await authenticatedFetch('/subscriptions')
      const data = res.ok ? await res.json() : null
      setSubscription(data)
    } catch {}
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        subscription,
        loading,
        error,
        fetchUser,
        ensureUser,
        refreshSubscription,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
