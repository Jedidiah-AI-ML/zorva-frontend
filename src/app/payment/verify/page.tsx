'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function PaymentVerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')

  useEffect(() => {
    const reference = searchParams.get('reference')
    if (!reference) {
      router.push('/dashboard')
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/verify/${reference}`)
      .then(res => {
        if (res.ok) {
          setStatus('success')
          setTimeout(() => router.push('/dashboard'), 2000)
        } else {
          setStatus('failed')
        }
      })
      .catch(() => setStatus('failed'))
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      {status === 'verifying' && <p>Verifying payment...</p>}
      {status === 'success' && (
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">Payment Successful!</p>
          <p className="text-muted-foreground mt-2">Redirecting to dashboard...</p>
        </div>
      )}
      {status === 'failed' && (
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500">Payment Failed</p>
          <p className="text-muted-foreground mt-2">Please try again.</p>
          <button onClick={() => router.push('/subscription')} className="mt-4 underline">
            Back to Subscription
          </button>
        </div>
      )}
    </div>
  )
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <PaymentVerifyContent />
    </Suspense>
  )
}