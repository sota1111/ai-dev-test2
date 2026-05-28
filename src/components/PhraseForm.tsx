'use client'
import { useState, useEffect } from 'react'
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

function findOccurrences(example: string, phrase: string): number[] {
  if (!phrase || !example) return []
  const indices: number[] = []
  const lower = example.toLowerCase()
  const target = phrase.toLowerCase()
  let start = 0
  while (true) {
    const idx = lower.indexOf(target, start)
    if (idx === -1) break
    indices.push(idx)
    start = idx + 1
  }
  return indices
}

function buildPreview(example: string, phrase: string, occurrenceIndex: number): string {
  const indices = findOccurrences(example, phrase)
  if (indices.length === 0) return example
  const targetIdx = indices[occurrenceIndex] ?? indices[0]
  return (
    example.slice(0, targetIdx) +
    '[' + example.slice(targetIdx, targetIdx + phrase.length) + ']' +
    example.slice(targetIdx + phrase.length)
  )
}

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
  const [selectedOccurrence, setSelectedOccurrence] = useState(0)

  const occurrences = findOccurrences(form.example, form.phrase)
  const phraseInExample = occurrences.length > 0
  const preview = phraseInExample
    ? buildPreview(form.example, form.phrase, selectedOccurrence)
    : null

  useEffect(() => {
    setSelectedOccurrence(0)
  }, [form.phrase, form.example])

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

      {/* Quality check section */}
      {form.phrase && form.example && (
        <div className={"p-3 rounded-lg border " + (phraseInExample ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50')}>
          {!phraseInExample ? (
            <div>
              <p className="text-yellow-800 font-medium text-sm">
                ⚠️ Warning: The phrase &ldquo;{form.phrase}&rdquo; was not found in the example sentence.
              </p>
              <p className="text-yellow-700 text-xs mt-1">
                A fill-in-the-blank question cannot be generated. You can still save, but consider updating the example to include the phrase.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-green-800 font-medium text-sm mb-2">
                ✓ Phrase found in example ({occurrences.length} occurrence{occurrences.length > 1 ? 's' : ''})
              </p>
              {occurrences.length > 1 && (
                <div className="mb-2">
                  <p className="text-green-700 text-xs mb-1">Select which occurrence to blank:</p>
                  <div className="flex gap-2 flex-wrap">
                    {occurrences.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedOccurrence(i)}
                        className={"px-2 py-1 text-xs rounded border " + (selectedOccurrence === i ? 'bg-green-600 text-white border-green-600' : 'border-green-400 text-green-700 hover:bg-green-100')}
                      >
                        #{i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-green-700 text-xs mb-1">Preview ([ ] marks the blank):</p>
                <p className="text-sm font-mono bg-white border border-green-200 px-2 py-1 rounded">{preview}</p>
              </div>
            </div>
          )}
        </div>
      )}

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
