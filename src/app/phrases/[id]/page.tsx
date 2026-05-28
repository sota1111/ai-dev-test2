'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Phrase {
  id: string
  phrase: string
  meaning: string
  example: string
  translation: string
  category: string
  memo: string
  difficulty: string
  totalCount: number
  correctCount: number
  accuracy: number | null
  createdAt: string
}

export default function PhraseDetailPage({ params }: { params: { id: string } }) {
  const [phrase, setPhrase] = useState<Phrase | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/phrases/' + params.id).then(r => r.json()).then(setPhrase)
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Delete this phrase?')) return
    await fetch('/api/phrases/' + params.id, { method: 'DELETE' })
    router.push('/phrases')
  }

  if (!phrase) return <div className="text-gray-500">Loading...</div>

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">{phrase.phrase}</h1>
        <div className="flex gap-2">
          <Link href={'/phrases/' + phrase.id + '/edit'} className="border px-4 py-2 rounded hover:bg-gray-100 text-sm">Edit</Link>
          <button onClick={handleDelete} className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 text-sm">Delete</button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-gray-500 text-sm">Meaning</span><p className="font-medium">{phrase.meaning}</p></div>
            <div><span className="text-gray-500 text-sm">Category</span><p><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">{phrase.category}</span></p></div>
            <div><span className="text-gray-500 text-sm">Difficulty</span><p>{phrase.difficulty}</p></div>
            <div><span className="text-gray-500 text-sm">Accuracy</span><p>{phrase.accuracy !== null ? phrase.accuracy + '%' : '—'} ({phrase.totalCount} attempts)</p></div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <span className="text-gray-500 text-sm">Example</span>
          <p className="mt-1 font-medium">{phrase.example}</p>
          {phrase.translation && <p className="mt-1 text-gray-600 text-sm">{phrase.translation}</p>}
        </div>

        {phrase.memo && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <span className="text-gray-500 text-sm">Memo</span>
            <p className="mt-1">{phrase.memo}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/phrases" className="text-blue-600 hover:underline text-sm">← Back to list</Link>
        <Link href="/review" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm ml-auto">Start Review</Link>
      </div>
    </div>
  )
}
