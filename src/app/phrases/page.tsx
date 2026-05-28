'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Phrase {
  id: string
  phrase: string
  meaning: string
  category: string
  difficulty: string
  nextReviewDate?: string | null
}

type ReviewStatus = '未復習' | '復習期限切れ' | '今日の復習対象' | '復習済み'

function getReviewStatus(nextReviewDate?: string | null): ReviewStatus {
  if (!nextReviewDate) return '未復習'
  const next = new Date(nextReviewDate)
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1)
  if (next < todayStart) return '復習期限切れ'
  if (next <= todayEnd) return '今日の復習対象'
  return '復習済み'
}

const STATUS_STYLES: Record<ReviewStatus, string> = {
  '未復習': 'bg-gray-100 text-gray-600',
  '復習期限切れ': 'bg-red-100 text-red-700',
  '今日の復習対象': 'bg-orange-100 text-orange-700',
  '復習済み': 'bg-green-100 text-green-700',
}

const CATEGORIES = ['', 'daily', 'business', 'email', 'connector', 'other']
const DIFFICULTIES = ['', 'easy', 'normal', 'hard']

export default function PhrasesPage() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (difficulty) params.set('difficulty', difficulty)
    fetch('/api/phrases?' + params.toString())
      .then(r => r.json())
      .then(data => { setPhrases(data); setLoading(false) })
  }, [search, category, difficulty])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Phrases</h1>
        <Link href="/phrases/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + New Phrase
        </Link>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search phrases..."
          className="border rounded px-3 py-2 flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All categories'}</option>)}
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d || 'All difficulties'}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : phrases.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">No phrases found.</p>
          <Link href="/phrases/new" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            Add your first phrase
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border-b">Phrase</th>
                <th className="text-left p-3 border-b">Meaning</th>
                <th className="text-left p-3 border-b">Category</th>
                <th className="text-left p-3 border-b">Difficulty</th>
                <th className="text-left p-3 border-b">Review Status</th>
                <th className="text-left p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {phrases.map(p => {
                const status = getReviewStatus(p.nextReviewDate)
                return (
                  <tr key={p.id} className="hover:bg-gray-50 border-b">
                    <td className="p-3 font-medium">{p.phrase}</td>
                    <td className="p-3 text-gray-600 text-sm">{p.meaning}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{p.category}</span>
                    </td>
                    <td className="p-3">
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">{p.difficulty}</span>
                    </td>
                    <td className="p-3">
                      <span className={'px-2 py-0.5 rounded text-xs font-medium ' + STATUS_STYLES[status]}>
                        {status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link href={'/phrases/' + p.id} className="text-blue-600 hover:underline text-sm mr-3">View</Link>
                      <Link href={'/phrases/' + p.id + '/edit'} className="text-gray-600 hover:underline text-sm">Edit</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
