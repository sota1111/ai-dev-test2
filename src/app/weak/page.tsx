'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface WeakPhrase {
  id: string
  phrase: string
  meaning: string
  category: string
  difficulty: string
  accuracy: number
  totalCount: number
  correctCount: number
  lastReviewedAt: string | null
}

export default function WeakPhrasesPage() {
  const [phrases, setPhrases] = useState<WeakPhrase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/phrases?weak=true&orderBy=accuracy_asc')
      .then(r => r.json())
      .then(data => {
        const reviewed = data.filter((p: WeakPhrase) => p.totalCount > 0)
        reviewed.sort((a: WeakPhrase, b: WeakPhrase) => (a.accuracy ?? 100) - (b.accuracy ?? 100))
        setPhrases(reviewed)
        setLoading(false)
      })
  }, [])

  const startWeakReview = () => {
    window.location.href = '/review/quiz?mode=weak'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Weak Phrases</h1>
        {phrases.length > 0 && (
          <button onClick={startWeakReview}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            Review All Weak Phrases
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : phrases.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No weak phrases yet!</p>
          <p className="text-sm mb-6">Complete some review sessions to see phrases you struggle with here.</p>
          <Link href="/review" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            Start a Review
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Showing {phrases.length} phrases you have reviewed, sorted by accuracy (lowest first).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 border-b">Phrase</th>
                  <th className="text-left p-3 border-b">Meaning</th>
                  <th className="text-left p-3 border-b">Category</th>
                  <th className="text-left p-3 border-b">Accuracy</th>
                  <th className="text-left p-3 border-b">Attempts</th>
                  <th className="text-left p-3 border-b">Last Reviewed</th>
                  <th className="text-left p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {phrases.map(p => (
                  <tr key={p.id} className={`hover:bg-gray-50 border-b ${(p.accuracy ?? 100) < 50 ? 'bg-red-50' : ''}`}>
                    <td className="p-3 font-medium">{p.phrase}</td>
                    <td className="p-3 text-gray-600 text-sm">{p.meaning}</td>
                    <td className="p-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">{p.category}</span></td>
                    <td className="p-3">
                      <span className={`font-bold ${(p.accuracy ?? 100) < 50 ? 'text-red-600' : 'text-yellow-600'}`}>
                        {p.accuracy}%
                      </span>
                    </td>
                    <td className="p-3 text-sm">{p.correctCount}/{p.totalCount}</td>
                    <td className="p-3 text-sm text-gray-500">
                      {p.lastReviewedAt ? new Date(p.lastReviewedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-3">
                      <Link href={'/phrases/' + p.id} className="text-blue-600 hover:underline text-sm">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
