import axios from "axios"

const {
  AUTH_HTTP_PORT,
  AUTH_HTTPS_PORT,
  NODE_HTTP_PORT,
  NODE_HTTPS_PORT,
  NODE_ENV,
} = process.env

// AUTH
const AUTH_BASE_URL =
  NODE_ENV === "production"
    ? `https://localhost:${AUTH_HTTPS_PORT}`
    : `http://localhost:${AUTH_HTTP_PORT}`
// API
const API_BASE_URL =
  NODE_ENV === "production"
    ? `https://localhost:${NODE_HTTPS_PORT}`
    : `http://localhost:${NODE_HTTP_PORT}`

console.log({
  AUTH_BASE_URL,
  API_BASE_URL,
})

const authHttpClient = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

const apiHttpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

// Request interceptor
// httpClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token")
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

// Response interceptor

let isRefreshing = false
let refreshSubscribers: any = []

// function subscribeTokenRefresh(cb: any) {
//   refreshSubscribers.push(cb)
// }

function onRrefreshed() {
  refreshSubscribers.forEach((cb: any) => cb())
  refreshSubscribers = []
}

authHttpClient.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config

    // If 401 and we haven’t retried yet
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Prevent multiple parallel refresh calls
      if (!isRefreshing) {
        isRefreshing = true

        try {
          await authHttpClient.post("/refreshToken", {})
          isRefreshing = false
          onRrefreshed()
          return authHttpClient(originalRequest) // retry original
        } catch (refreshErr) {
          isRefreshing = false

          // ❌ Refresh failed → redirect to login
          // window.location.href = "/login"
          return Promise.reject(refreshErr)
        }
      }

      // If another refresh is already happening, queue the request
      // return new Promise((resolve) => {
      //   subscribeTokenRefresh(() => {
      //     resolve(authHttpClient(originalRequest))
      //   })
      // })
    }

    return Promise.reject(err)
  },
)

apiHttpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error cases globally
    if (error.response?.status === 401) {
      // redirect to login, refresh token, etc.
    }
    return Promise.reject(error)
  },
)

export { authHttpClient, apiHttpClient }
