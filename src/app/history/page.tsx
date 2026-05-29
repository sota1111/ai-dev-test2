'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface HistoryRecord {
  id: string
  phraseId: string
  phraseText: string
  meaning: string
  isCorrect: boolean
  hintCount: number
  userAnswer: string
  skipped: boolean
  answeredAt: string
}

interface DayGroup {
  date: string
  records: HistoryRecord[]
}

export default function HistoryPage() {
  const [groups, setGroups] = useState<DayGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/history')
      .then(r => r.json())
      .then(data => { setGroups(data); setLoading(false) })
  }, [])

  if (loading) return <div className="text-gray-500">Loading history...</div>

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Learning History</h1>
      {groups.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No history yet.</p>
          <Link href="/review" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">Start reviewing</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(g => (
            <div key={g.date} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b px-4 py-2 flex justify-between items-center">
                <span className="font-semibold">{g.date}</span>
                <span className="text-sm text-gray-500">
                  {g.records.length} reviews — {g.records.filter(r => r.isCorrect).length} correct
                </span>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {g.records.map(r => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-3 w-1/3">
                        <Link href={'/phrases/' + r.phraseId} className="font-medium text-blue-700 hover:underline">{r.phraseText}</Link>
                        <div className="text-xs text-gray-400">{r.meaning}</div>
                      </td>
                      <td className="p-3 text-gray-500 text-xs w-1/4">{r.userAnswer || '—'}</td>
                      <td className="p-3 w-1/4">
                        {r.skipped ? (
                          <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded">Skipped</span>
                        ) : r.isCorrect ? (
                          <span className="text-green-700 text-xs bg-green-100 px-2 py-0.5 rounded">
                            ✓{r.hintCount > 0 ? ` (${r.hintCount} hint${r.hintCount > 1 ? 's' : ''})` : ''}
                          </span>
                        ) : (
                          <span className="text-red-700 text-xs bg-red-100 px-2 py-0.5 rounded">✗ Incorrect</span>
                        )}
                      </td>
                      <td className="p-3 text-xs text-gray-400">{new Date(r.answeredAt).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
