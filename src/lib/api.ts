'use client'

import { useAuth } from '@clerk/nextjs'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// ── API client with automatic JWT injection ───────────────────────────────
async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  token: string | null = null
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `Request failed: ${response.status}`)
  }

  return response.json()
}


// ── Hook for authenticated API calls ─────────────────────────────────────
// Use this in components:
// const { getToken } = useApiClient()
// const courses = await getToken().then(token => getCourses(token))

export function useApiClient() {
  const { getToken } = useAuth()

  const withToken = async (fn: (token: string) => Promise<any>) => {
    const token = await getToken()
    if (!token) throw new Error('Not authenticated')
    return fn(token)
  }

  const getPresignedUrl = (data: {
    filename: string
    content_type: string
    doc_type: string
    course_id: string
  }) =>
    withToken(token =>
      apiRequest('/api/v1/storage/presign', {
        method: 'POST',
        body: JSON.stringify(data),
      }, token)
    )
  
  const confirmUpload = (data: {
    file_key: string
    file_name: string
    file_type: string
    doc_type: string
    course_id: string
  }) =>
    withToken(token =>
      apiRequest('/api/v1/documents/confirm', {
        method: 'POST',
        body: JSON.stringify(data),
      }, token)
    )

  // ── Courses ──────────────────────────────────────────────────────────
  const getCourses = () =>
    withToken(token => apiRequest('/api/v1/courses', {}, token))

  const createCourse = (data: { name: string; institution?: string; department?: string }) =>
    withToken(token =>
      apiRequest('/api/v1/courses', {
        method: 'POST',
        body: JSON.stringify(data),
      }, token)
    )

  const deleteCourse = (courseId: string) =>
    withToken(token =>
      apiRequest(`/api/v1/courses/${courseId}`, { method: 'DELETE' }, token)
    )

  // ── Documents ────────────────────────────────────────────────────────
  const getCourseDocuments = (courseId: string) =>
    withToken(token =>
      apiRequest(`/api/v1/courses/${courseId}/documents`, {}, token)
    )

  const uploadCourseMaterial = (courseId: string, file: File) =>
    withToken(async token => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch(
        `${API_URL}/api/v1/courses/${courseId}/documents/material`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      )
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.detail || 'Upload failed')
      }
      return response.json()
    })

  const uploadPastQuestion = (courseId: string, file: File) =>
    withToken(async token => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch(
        `${API_URL}/api/v1/courses/${courseId}/documents/past-question`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      )
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.detail || 'Upload failed')
      }
      return response.json()
    })

  const getDocumentStatus = (documentId: string) =>
    withToken(token =>
      apiRequest(`/api/v1/documents/${documentId}/status`, {}, token)
    )

  const deleteDocument = (documentId: string) =>
    withToken(token =>
      apiRequest(`/api/v1/documents/${documentId}`, { method: 'DELETE' }, token)
    )

  // ── Analysis ─────────────────────────────────────────────────────────
  const analyseCourse = (courseId: string) =>
    withToken(token =>
      apiRequest(`/api/v1/courses/${courseId}/analyse`, { method: 'POST' }, token)
    )

  const getCoursePatterns = (courseId: string) =>
    withToken(token =>
      apiRequest(`/api/v1/courses/${courseId}/patterns`, {}, token)
    )

  // ── Generation ───────────────────────────────────────────────────────
  const generateQuestions = (courseId: string) =>
    withToken(token =>
      apiRequest(`/api/v1/courses/${courseId}/generate`, { method: 'POST' }, token)
    )

  const getSessionQuestions = (sessionId: string) =>
    withToken(token =>
      apiRequest(`/api/v1/sessions/${sessionId}/questions`, {}, token)
    )

  const getCourseSession = (courseId: string) =>
    withToken(token =>
      apiRequest(`/api/v1/courses/${courseId}/sessions`, {}, token)
    )

  // ── Payments ─────────────────────────────────────────────────────────
  const initializePayment = (planType: 'monthly' | 'yearly') =>
    withToken(token =>
      apiRequest('/api/v1/payments/initialize', {
        method: 'POST',
        body: JSON.stringify({ plan_type: planType }),
      }, token)
    )

  const getSubscriptionStatus = () =>
    withToken(token =>
      apiRequest('/api/v1/payments/subscription', {}, token)
    )

  const cancelSubscription = () =>
    withToken(token =>
      apiRequest('/api/v1/payments/cancel', { method: 'POST' }, token)
    )

  // ── Auth ─────────────────────────────────────────────────────────────
  const getMe = () =>
    withToken(token => apiRequest('/api/v1/auth/me', {}, token))

  return {
    getCourses,
    createCourse,
    deleteCourse,
    getCourseDocuments,
    uploadCourseMaterial,
    uploadPastQuestion,
    getDocumentStatus,
    deleteDocument,
    analyseCourse,
    getCoursePatterns,
    generateQuestions,
    getSessionQuestions,
    getCourseSession,
    initializePayment,
    getSubscriptionStatus,
    cancelSubscription,
    getMe,
    getPresignedUrl,
    confirmUpload,
  }
}