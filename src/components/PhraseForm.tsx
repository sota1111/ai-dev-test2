'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PhraseFormProps {
  initialData?: {
    phrase?: string
    meaning?: string
    example?: string
    translation?: string
    category?: string
    memo?: string
    difficulty?: string
  }
  onSubmit: (data: Record<string, string>) => Promise<void>
  submitLabel?: string
}

const CATEGORIES = ['daily', 'business', 'email', 'connector', 'other']
const DIFFICULTIES = ['easy', 'normal', 'hard']

export default function PhraseForm({ initialData = {}, onSubmit, submitLabel = 'Save' }: PhraseFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    phrase: initialData.phrase || '',
    meaning: initialData.meaning || '',
    example: initialData.example || '',
    translation: initialData.translation || '',
    category: initialData.category || 'other',
    memo: initialData.memo || '',
    difficulty: initialData.difficulty || 'normal',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.phrase || !form.meaning || !form.example) {
      setError('Phrase, meaning, and example are required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onSubmit(form)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">Phrase *</label>
        <input name="phrase" value={form.phrase} onChange={handleChange} required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Meaning *</label>
        <input name="meaning" value={form.meaning} onChange={handleChange} required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Example sentence *</label>
        <textarea name="example" value={form.example} onChange={handleChange} required rows={2}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Translation</label>
        <textarea name="translation" value={form.translation} onChange={handleChange} rows={2}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <select name="difficulty" value={form.difficulty} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Memo</label>
        <textarea name="memo" value={form.memo} onChange={handleChange} rows={2}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border px-6 py-2 rounded hover:bg-gray-100">
          Cancel
        </button>
      </div>
    </form>
  )
}
