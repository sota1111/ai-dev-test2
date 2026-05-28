'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

function SummaryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const total = parseInt(searchParams.get('total') || '0')
  const correct = parseInt(searchParams.get('correct') || '0')
  const incorrectIds = searchParams.get('incorrectIds') || ''
  const incorrect = total - correct
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  const reviewIncorrect = () => {
    router.push('/review/quiz?mode=incorrect&incorrectIds=' + encodeURIComponent(incorrectIds))
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Review Results</h1>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-3xl font-bold">{total}</p><p className="text-sm text-gray-500">Total</p></div>
          <div><p className="text-3xl font-bold text-green-600">{correct}</p><p className="text-sm text-gray-500">Correct</p></div>
          <div><p className="text-3xl font-bold text-red-600">{incorrect}</p><p className="text-sm text-gray-500">Incorrect</p></div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-4xl font-bold">{accuracy}%</p>
          <p className="text-gray-500">Accuracy</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {incorrect > 0 && (
          <button onClick={reviewIncorrect}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium">
            Review {incorrect} Incorrect Phrases Again
          </button>
        )}
        <Link href="/review"
          className="w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
          Start New Review
        </Link>
        <Link href="/phrases"
          className="w-full text-center border py-3 rounded-lg hover:bg-gray-100">
          Back to Phrase List
        </Link>
      </div>
    </div>
  )
}

export default function SummaryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SummaryContent />
    </Suspense>
  )
}
