'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Phrase {
  id: string
  phrase: string
  meaning: string
  category: string
  difficulty: string
  accuracy: number | null
  totalCount: number
  lastReviewedAt: string | null
}

export default function PhrasesPage() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchPhrases = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    const res = await fetch('/api/phrases?' + params.toString())
    const data = await res.json()
    setPhrases(data)
    setLoading(false)
  }

  useEffect(() => { fetchPhrases() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPhrases()
  }

  const handleDelete = async (id: string, phrase: string) => {
    if (!confirm(`Delete "${phrase}"?`)) return
    await fetch('/api/phrases/' + id, { method: 'DELETE' })
    fetchPhrases()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Phrases</h1>
        <Link href="/phrases/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Phrase
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..."
          className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All categories</option>
          {['daily','business','email','connector','other'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">Search</button>
      </form>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : phrases.length === 0 ? (
        <div className="text-gray-500">No phrases found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border-b">Phrase</th>
                <th className="text-left p-3 border-b">Meaning</th>
                <th className="text-left p-3 border-b">Category</th>
                <th className="text-left p-3 border-b">Difficulty</th>
                <th className="text-left p-3 border-b">Accuracy</th>
                <th className="text-left p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {phrases.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 border-b">
                  <td className="p-3 font-medium">{p.phrase}</td>
                  <td className="p-3 text-gray-600">{p.meaning}</td>
                  <td className="p-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">{p.category}</span></td>
                  <td className="p-3 text-sm">{p.difficulty}</td>
                  <td className="p-3 text-sm">{p.accuracy !== null ? p.accuracy + '%' : '—'} ({p.totalCount})</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link href={'/phrases/' + p.id} className="text-blue-600 hover:underline text-sm">View</Link>
                      <Link href={'/phrases/' + p.id + '/edit'} className="text-green-600 hover:underline text-sm">Edit</Link>
                      <button onClick={() => handleDelete(p.id, p.phrase)} className="text-red-600 hover:underline text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
