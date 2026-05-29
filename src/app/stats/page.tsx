'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface StatsData {
  totalPhrases: number
  unreviewedCount: number
  totalReviews: number
  overallAccuracy: number | null
  categoryStats: { category: string; total: number; correct: number; accuracy: number | null }[]
  difficultyStats: { difficulty: string; total: number; correct: number; accuracy: number | null }[]
  last7Days: { date: string; count: number }[]
  topWeakPhrases: { id: string; phrase: string; meaning: string; category: string; total: number; incorrect: number; accuracy: number }[]
}

function AccuracyBar(props: { accuracy: number | null }) {
  const accuracy = props.accuracy
  if (accuracy === null) return <span className="text-gray-400 text-sm">No data</span>
  const color = accuracy >= 80 ? 'bg-green-500' : accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
        <div className={"h-2 rounded-full " + color} style={{ width: accuracy + '%' }} />
      </div>
      <span className="text-sm font-medium w-10 text-right">{accuracy}%</span>
    </div>
  )
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
  }, [])

  if (loading) return <div className="text-gray-500 p-6">Loading stats...</div>
  if (!stats) return <div className="text-red-500 p-6">Failed to load stats.</div>

  const last7DaysArr = stats.last7Days
  const maxDailyCount = Math.max(...last7DaysArr.map(d => d.count), 1)

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold">Learning Stats</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-700">{stats.totalPhrases}</div>
          <div className="text-sm text-gray-500 mt-1">Total Phrases</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-700">{stats.totalReviews}</div>
          <div className="text-sm text-gray-500 mt-1">Total Reviews</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-700">{stats.overallAccuracy !== null ? stats.overallAccuracy + '%' : 'N/A'}</div>
          <div className="text-sm text-gray-500 mt-1">Overall Accuracy</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-700">{stats.unreviewedCount}</div>
          <div className="text-sm text-gray-500 mt-1">Unreviewed</div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Reviews - Last 7 Days</h2>
        <div className="flex items-end gap-2 h-24">
          {last7DaysArr.map(d => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{d.count}</span>
              <div
                className="w-full bg-blue-400 rounded-t"
                style={{ height: Math.max((d.count / maxDailyCount) * 80, d.count > 0 ? 4 : 0) + 'px' }}
              />
              <span className="text-xs text-gray-400">{d.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">By Category</h2>
          <div className="space-y-3">
            {stats.categoryStats.length === 0
              ? <p className="text-gray-400 text-sm">No data</p>
              : stats.categoryStats.map(c => (
                <div key={c.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{c.category}</span>
                    <span className="text-gray-500">{c.correct}/{c.total}</span>
                  </div>
                  <AccuracyBar accuracy={c.accuracy} />
                </div>
              ))
            }
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">By Difficulty</h2>
          <div className="space-y-3">
            {stats.difficultyStats.length === 0
              ? <p className="text-gray-400 text-sm">No data</p>
              : stats.difficultyStats.map(d => (
                <div key={d.difficulty}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{d.difficulty}</span>
                    <span className="text-gray-500">{d.correct}/{d.total}</span>
                  </div>
                  <AccuracyBar accuracy={d.accuracy} />
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Most Challenging Phrases</h2>
        {stats.topWeakPhrases.length === 0 ? (
          <p className="text-gray-400 text-sm">No review data yet. Start reviewing to see stats here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-2">Phrase</th>
                  <th className="text-left p-2">Meaning</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-right p-2">Incorrect</th>
                  <th className="text-left p-2 min-w-32">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {stats.topWeakPhrases.map(p => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">
                      <Link href={'/phrases/' + p.id} className="text-blue-600 hover:underline">{p.phrase}</Link>
                    </td>
                    <td className="p-2 text-gray-600">{p.meaning}</td>
                    <td className="p-2"><span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs">{p.category}</span></td>
                    <td className="p-2 text-right text-red-600 font-medium">{p.incorrect}</td>
                    <td className="p-2"><AccuracyBar accuracy={p.accuracy} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
