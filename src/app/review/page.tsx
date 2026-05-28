'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MODES = [
  { value: 'all', label: 'All phrases', desc: 'Review all registered phrases' },
  { value: 'unreviewed', label: 'Unreviewed only', desc: 'Phrases you have never reviewed' },
  { value: 'weak', label: 'Weak phrases', desc: 'Phrases with accuracy below 50%' },
]
const CATEGORIES = ['', 'daily', 'business', 'email', 'connector', 'other']
const DIFFICULTIES = ['', 'easy', 'normal', 'hard']

export default function ReviewPage() {
  const router = useRouter()
  const [mode, setMode] = useState('all')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')

  const startReview = () => {
    const params = new URLSearchParams({ mode })
    if (category) params.set('category', category)
    if (difficulty) params.set('difficulty', difficulty)
    router.push('/review/quiz?' + params.toString())
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Start Review</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Review mode</label>
        <div className="space-y-2">
          {MODES.map(m => (
            <label key={m.value} className={'flex items-start gap-3 p-3 border rounded-lg cursor-pointer ' + (mode === m.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50')}>
              <input type="radio" name="mode" value={m.value} checked={mode === m.value}
                onChange={e => setMode(e.target.value)} className="mt-1" />
              <div>
                <div className="font-medium">{m.label}</div>
                <div className="text-sm text-gray-500">{m.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All categories'}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d || 'All difficulties'}</option>)}
          </select>
        </div>
      </div>

      <button onClick={startReview}
        className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700">
        Start Review
      </button>
    </div>
  )
}
