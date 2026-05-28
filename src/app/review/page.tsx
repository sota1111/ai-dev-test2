'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const MODES = [
  { value: 'schedule', label: "Today's Review", desc: 'Phrases due today (spaced repetition)' },
  { value: 'all', label: 'All phrases', desc: 'Review all registered phrases' },
  { value: 'unreviewed', label: 'Unreviewed only', desc: 'Phrases you have never reviewed' },
  { value: 'weak', label: 'Weak phrases', desc: 'Phrases with accuracy below 50%' },
]
const CATEGORIES = ['', 'daily', 'business', 'email', 'connector', 'other']
const DIFFICULTIES = ['', 'easy', 'normal', 'hard']
const LIMITS = [
  { value: '5', label: '5 questions' },
  { value: '10', label: '10 questions' },
  { value: '20', label: '20 questions' },
  { value: '50', label: '50 questions' },
  { value: 'all', label: 'All' },
]
const ORDERS = [
  { value: 'random', label: 'Random' },
  { value: 'accuracy_asc', label: 'Low accuracy first' },
  { value: 'oldest', label: 'Oldest reviewed first' },
]

export default function ReviewPage() {
  const router = useRouter()
  const [mode, setMode] = useState('schedule')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [limit, setLimit] = useState('10')
  const [order, setOrder] = useState('random')
  const [count, setCount] = useState<number | null>(null)
  const [countLoading, setCountLoading] = useState(false)

  useEffect(() => {
    setCountLoading(true)
    const params = new URLSearchParams({ mode, countOnly: 'true' })
    if (category) params.set('category', category)
    if (difficulty) params.set('difficulty', difficulty)
    fetch('/api/review?' + params.toString())
      .then(r => r.json())
      .then(data => {
        setCount(data.count ?? null)
        setCountLoading(false)
      })
      .catch(() => setCountLoading(false))
  }, [mode, category, difficulty])

  const startReview = () => {
    const params = new URLSearchParams({ mode, order })
    if (category) params.set('category', category)
    if (difficulty) params.set('difficulty', difficulty)
    if (limit !== 'all') params.set('limit', limit)
    router.push('/review/quiz?' + params.toString())
  }

  const effectiveCount = count === null ? '?' : Math.min(count, limit === 'all' ? Infinity : parseInt(limit)).toString().replace('Infinity', count.toString())

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

      <div className="grid grid-cols-2 gap-4 mb-4">
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

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Number of questions</label>
          <select value={limit} onChange={e => setLimit(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {LIMITS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Order</label>
          <select value={order} onChange={e => setOrder(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {ORDERS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
        {countLoading ? (
          <span className="text-blue-600">Counting matching phrases...</span>
        ) : (
          <span className="text-blue-800">
            <span className="font-semibold">{count ?? '?'}</span> phrase{count !== 1 ? 's' : ''} match your filters
            {count !== null && limit !== 'all' && count > parseInt(limit)
              ? ` → will show ${limit}`
              : ''}
          </span>
        )}
      </div>

      <button onClick={startReview} disabled={count === 0}
        className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
        {count === 0 ? 'No phrases match' : `Start Review (${effectiveCount} questions)`}
      </button>
    </div>
  )
}
