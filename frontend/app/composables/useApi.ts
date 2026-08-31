import { ref } from 'vue'

export const useAuth = () => {
  const token = ref<string | null>(typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null)
  const user = ref<any>(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('auth_user') || 'null') : null)

  function setAuth(newToken: string, newUser: any) {
    token.value = newToken
    user.value = newUser
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('auth_user', JSON.stringify(newUser))
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

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    return await $fetch<T>(endpoint, {
      baseURL: apiBase,
      ...options,
      headers
    })
  }

  return { apiBase, apiFetch }
}
