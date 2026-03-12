const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface RequestOptions extends RequestInit {
  requireAuth?: boolean
}

class APIError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.data = data
  }
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refresh_token')
}

function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
}

function clearTokens(): void {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      }
    })

    if (!response.ok) {
      clearTokens()
      return null
    }

    const data = await response.json()
    localStorage.setItem('access_token', data.access_token)
    return data.access_token
  } catch {
    clearTokens()
    return null
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requireAuth = false, ...fetchOptions } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (requireAuth) {
    let token = getAccessToken()

    if (!token) {
      throw new APIError('Authentication required', 401)
    }

    ; (headers as any)['Authorization'] = `Bearer ${token}`
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  let response = await fetch(url, {
    ...fetchOptions,
    headers
  })

  // Handle token refresh on 401
  if (response.status === 401 && requireAuth) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      ; (headers as any)['Authorization'] = `Bearer ${newToken}`
      response = await fetch(url, {
        ...fetchOptions,
        headers
      })
    } else {
      throw new APIError('Session expired. Please log in again.', 401)
    }
  }

  // Handle blob responses (PDF downloads)
  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/pdf')) {
    if (!response.ok) {
      throw new APIError('Failed to download PDF', response.status)
    }
    return response.blob() as unknown as T
  }

  const data = await response.json()

  if (!response.ok) {
    throw new APIError(
      data.error || 'An error occurred',
      response.status,
      data
    )
  }

  return data as T
}

// Auth API
export const authAPI = {
  sendOtp: async (email: string) => {
    return request<{ message: string }>('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },

  register: async (username: string, password: string, email: string, otp: string) => {
    const data = await request<{
      message: string
      user: { id: number; username: string; email?: string }
      access_token: string
      refresh_token: string
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email, otp })
    })

    setTokens(data.access_token, data.refresh_token)
    localStorage.setItem('user', JSON.stringify(data.user))

    return data
  },

  login: async (username: string, password: string) => {
    const data = await request<{
      message: string
      user: { id: number; username: string; email?: string }
      access_token: string
      refresh_token: string
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })

    setTokens(data.access_token, data.refresh_token)
    localStorage.setItem('user', JSON.stringify(data.user))

    return data
  },

  logout: async () => {
    try {
      await request('/api/auth/logout', {
        method: 'POST',
        requireAuth: true
      })
    } finally {
      clearTokens()
    }
  },

  getMe: async () => {
    return request<{
      user: { id: number; username: string; email?: string; created_at: string }
      stats: {
        total_verifications: number
        fake_count: number
        real_count: number
        avg_credibility: number
        recent_verifications: number
      }
    }>('/api/auth/me', { requireAuth: true })
  },

  isAuthenticated: () => {
    return !!getAccessToken()
  },

  getUser: () => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  clearUser: () => {
    clearTokens()
  }
}

// Prediction API
export const predictAPI = {
  analyze: async (data: { text?: string; url?: string }) => {
    return request<{
      verification_id: number
      label: 'Real' | 'Fake'
      confidence: number
      credibility_score: number
      credibility_level: string
      analysis: {
        emotional_tone: number
        factual_tone: number
        neutrality_score: number
        sensational_score: number
        exaggeration_score: number
        clickbait_score: number
      }
      source_analysis: {
        domain: string | null
        reliability_score: number
        is_trusted: boolean
        trusted_similarity: number
        claim_consistency: number
        category: string
      }
      suspicious_phrases: Array<{
        text: string
        start: number
        end: number
        category: string
        reason: string
      }>
      highlighted_text: Array<{
        text: string
        start: number
        end: number
        reason: string
        category: string
        severity: string
      }>
      reason_summary: string
      credibility_explanation: string
      extracted_info?: {
        title: string
        authors: string[]
        url: string
      }
      model_info: {
        loaded: boolean
        note?: string
      }
    }>('/api/predict', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    })
  },

  analyzePublic: async (data: { text?: string; url?: string }) => {
    return request<{
      label: 'Real' | 'Fake'
      confidence: number
      credibility_score: number
      keywords: Array<{ text: string; category: string }>
      reason_summary: string
    }>('/predict', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

// History API
export const historyAPI = {
  getHistory: async (limit = 20, offset = 0) => {
    return request<{
      items: Array<{
        id: number
        text_content: string
        url?: string
        title?: string
        prediction_label: 'Real' | 'Fake'
        confidence_score: number
        credibility_score: number
        created_at: string
      }>
      total: number
      limit: number
      offset: number
      has_more: boolean
    }>(`/api/history?limit=${limit}&offset=${offset}`, { requireAuth: true })
  },

  getVerification: async (id: number) => {
    return request<{
      id: number
      text_content: string
      url?: string
      title?: string
      prediction_label: 'Real' | 'Fake'
      confidence_score: number
      credibility_score: number
      created_at: string
      analysis?: {
        emotional_tone: number
        factual_tone: number
        neutrality_score: number
        sensational_score: number
        exaggeration_score: number
        clickbait_score: number
        reason_summary: string
        suspicious_phrases: unknown[]
        highlighted_text: unknown[]
      }
      source_analysis?: {
        domain: string | null
        reliability_score: number
        trusted_similarity: number
        claim_consistency: number
      }
    }>(`/api/history/${id}`, { requireAuth: true })
  },

  deleteVerification: async (id: number) => {
    return request<{ message: string }>(`/api/history/${id}`, {
      method: 'DELETE',
      requireAuth: true
    })
  },

  getStats: async () => {
    return request<{
      total_verifications: number
      fake_count: number
      real_count: number
      avg_credibility: number
      recent_verifications: number
    }>('/api/history/stats', { requireAuth: true })
  }
}

// Analytics API
export const analyticsAPI = {
  getTrends: async (days = 30) => {
    return request<{
      trends: Array<{
        date: string
        total: number
        fake: number
        real: number
        avg_credibility: number
      }>
    }>(`/api/analytics/trends?days=${days}`, { requireAuth: true })
  },

  getSummary: async () => {
    return request<{
      total_verifications: number
      fake_count: number
      real_count: number
      avg_credibility: number
      recent_verifications: number
    }>('/api/analytics/summary', { requireAuth: true })
  }
}

// Report API
export const reportAPI = {
  downloadPdf: async (verificationId: number): Promise<Blob> => {
    return request<Blob>(`/api/report/${verificationId}/pdf`, { requireAuth: true })
  }
}

export { APIError }
