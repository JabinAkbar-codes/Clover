import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const client = axios.create({ baseURL: API_BASE, timeout: 20000 })

client.interceptors.request.use((config) => {
  const access = localStorage.getItem('clover_access')
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

let refreshing = null

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const refresh = localStorage.getItem('clover_refresh')

    if (error.response?.status === 401 && refresh && !original._retry) {
      original._retry = true
      try {
        if (!refreshing) {
          refreshing = axios
            .post(`${API_BASE}/auth/login/refresh/`, { refresh })
            .then((r) => r.data.access)
            .finally(() => {
              refreshing = null
            })
        }
        const newAccess = await refreshing
        localStorage.setItem('clover_access', newAccess)
        original.headers.Authorization = `Bearer ${newAccess}`
        return client(original)
      } catch {
        localStorage.removeItem('clover_access')
        localStorage.removeItem('clover_refresh')
      }
    }
    return Promise.reject(error)
  }
)

export default client
