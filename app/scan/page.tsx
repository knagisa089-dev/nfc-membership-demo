'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Result = {
  result: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'NOT_FOUND'
  customer?: {
    name: string
    email: string | null
    expiresAt: string | null
  }
}

export default function ScanPage() {
  const searchParams = useSearchParams()
  const uid = searchParams.get('uid')
  const [data, setData] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) {
      setLoading(false)
      return
    }
    fetch(`/api/scan?uid=${uid}`)
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
  }, [uid])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">確認中...</p>
      </main>
    )
  }

  if (!uid) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">UIDが指定されていません</p>
      </main>
    )
  }

  const isActive = data?.result === 'ACTIVE'
  const isExpired = data?.result === 'EXPIRED'
  const isSuspended = data?.result === 'SUSPENDED'

  return (
    <main className={`min-h-screen flex items-center justify-center p-8 ${
      isActive ? 'bg-green-50' :
      isExpired ? 'bg-red-50' :
      isSuspended ? 'bg-orange-50' :
      'bg-gray-50'
    }`}>
      <div className="text-center max-w-sm w-full">
        <div className={`text-8xl mb-6 ${
          isActive ? 'text-green-500' :
          isExpired ? 'text-red-500' :
          isSuspended ? 'text-orange-500' :
          'text-gray-400'
        }`}>
          {isActive ? '✓' : '✗'}
        </div>

        <h1 className={`text-3xl font-bold mb-2 ${
          isActive ? 'text-green-700' :
          isExpired ? 'text-red-700' :
          isSuspended ? 'text-orange-700' :
          'text-gray-600'
        }`}>
          {isActive ? '会員有効' :
           isExpired ? '期限切れ' :
           isSuspended ? '利用停止中' :
           '未登録のタグ'}
        </h1>

        {data?.customer && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 mt-6 text-left">
            <p className="font-semibold text-gray-800 text-lg">{data.customer.name}</p>
            {data.customer.email && (
              <p className="text-sm text-gray-400 mt-1">{data.customer.email}</p>
            )}
            {data.customer.expiresAt && (
              <p className="text-sm text-gray-500 mt-3">
                有効期限：{new Date(data.customer.expiresAt).toLocaleDateString('ja-JP')}
              </p>
            )}
          </div>
        )}

        <a href="/" className="inline-block mt-8 text-sm text-gray-400 hover:text-gray-600">
          管理画面に戻る
        </a>
      </div>
    </main>
  )
}