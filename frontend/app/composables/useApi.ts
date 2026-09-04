import { ref } from 'vue'

const token = ref<string | null>(typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null)
const user = ref<any>(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('auth_user') || 'null') : null)

export const useAuth = () => {
  // Sync with localStorage on client
  if (typeof window !== 'undefined' && !token.value && localStorage.getItem('auth_token')) {
    token.value = localStorage.getItem('auth_token')
    user.value = JSON.parse(localStorage.getItem('auth_user') || 'null')
  }

  function setAuth(newToken: string, newUser: any) {
    token.value = newToken
    user.value = newUser
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('auth_user', JSON.stringify(newUser || {}))
    }
  }

  function clearAuth() {
    token.value = null
    user.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  return { token, user, setAuth, clearAuth }
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'https://restaurant-backend-2d2w.vercel.app/api/v1'
  const { token } = useAuth()

  async function apiFetch<T = any>(endpoint: string, options: any = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }

    // Only send Authorization header if token exists and is a valid 3-part JWT token
    const isJwt = (t: any) => typeof t === 'string' && t.split('.').length === 3
    if (token.value && isJwt(token.value)) {
      headers['Authorization'] = token.value.startsWith('Bearer ') ? token.value : `Bearer ${token.value}`
    }

    return await $fetch<T>(endpoint, {
      baseURL: apiBase,
      ...options,
      headers
    })
  }

  return { apiBase, apiFetch }
}
