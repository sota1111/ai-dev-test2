'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { checkAnswer, buildBlank, MatchType } from '@/lib/quiz'

interface Phrase {
  id: string
  phrase: string
  meaning: string
  example: string
  translation: string
  category: string
  memo: string
  difficulty: string
}

interface QuizResult {
  phraseId: string
  phrase: string
  correct: boolean
}

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [matchType, setMatchType] = useState<MatchType>('incorrect')
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [hintLevel, setHintLevel] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    fetch('/api/review?' + params.toString())
      .then(r => r.json())
      .then(data => {
        if (!data || data.length === 0) { router.push('/phrases'); return }
        setPhrases(data)
        setLoading(false)
      })
  }, [searchParams, router])

  const current = phrases[index]

  const handleHint = () => {
    setHintLevel(prev => Math.min(prev + 1, 3))
  }

  const getHintLines = (): string[] => {
    if (!current || hintLevel === 0) return []
    const lines: string[] = []
    if (hintLevel >= 1) lines.push(`Hint 1 — Meaning: ${current.meaning}`)
    if (hintLevel >= 2) lines.push(`Hint 2 — First letter: ${current.phrase[0]}`)
    if (hintLevel >= 3) lines.push(`Hint 3 — Word count: ${current.phrase.split(' ').length} words`)
    return lines
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!current) return
    const mt = checkAnswer(answer, current.phrase)
    const correct = mt !== 'incorrect'
    setMatchType(mt)
    setSubmitted(true)

    await fetch('/api/learning-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phraseId: current.id,
        isCorrect: correct,
        hintCount: hintLevel,
        userAnswer: answer,
        skipped: false,
      }),
    })

    setResults(prev => [...prev, { phraseId: current.id, phrase: current.phrase, correct }])
  }

  const handleSkip = async () => {
    if (!current) return
    await fetch('/api/learning-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phraseId: current.id,
        isCorrect: false,
        hintCount: hintLevel,
        userAnswer: '',
        skipped: true,
      }),
    })
    setResults(prev => [...prev, { phraseId: current.id, phrase: current.phrase, correct: false }])
    goNext()
  }

  const goNext = () => {
    if (index + 1 >= phrases.length) {
      const incorrectIds = results.filter(r => !r.correct).map(r => r.phraseId).join(',')
      router.push('/review/summary?total=' + phrases.length +
        '&correct=' + results.filter(r => r.correct).length +
        '&incorrectIds=' + encodeURIComponent(incorrectIds))
      return
    }
    setIndex(prev => prev + 1)
    setAnswer('')
    setSubmitted(false)
    setMatchType('incorrect')
    setHintLevel(0)
  }

  if (loading) return <div className="text-gray-500">Loading...</div>
  if (!current) return null

  const blank = buildBlank(current.example, current.phrase)
  const hintLines = getHintLines()

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-500">Question {index + 1} / {phrases.length}</span>
        <div className="w-48 bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: ((index) / phrases.length * 100) + '%' }} />
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-4">
        <p className="text-lg mb-4 font-medium">{blank}</p>
        <p className="text-sm text-gray-500">Category: {current.category} | Difficulty: {current.difficulty}</p>
        {hintLines.length > 0 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded space-y-1">
            {hintLines.map((line, i) => (
              <p key={i} className="text-sm text-yellow-800">{line}</p>
            ))}
          </div>
        )}
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="Type the missing phrase..."
            className="w-full border-2 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500"
            autoFocus />
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">Answer</button>
            <button type="button" onClick={handleHint} disabled={hintLevel >= 3}
              className="border px-6 py-3 rounded-lg hover:bg-yellow-50 border-yellow-400 text-yellow-700 disabled:opacity-40 disabled:cursor-not-allowed">
              {hintLevel === 0 ? 'Hint' : `Hint (${hintLevel}/3)`}
            </button>
            <button type="button" onClick={handleSkip} className="border px-6 py-3 rounded-lg hover:bg-gray-100">Skip</button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${matchType !== 'incorrect' ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            <p className="text-lg font-bold mb-1">
              {matchType === 'exact' ? '✓ Correct!' : matchType === 'normalized' ? '✓ Acceptable (minor variation)' : '✗ Incorrect'}
            </p>
            {hintLevel > 0 && matchType !== 'incorrect' && (
              <p className="text-sm text-yellow-700 mb-1">Used {hintLevel} hint{hintLevel > 1 ? 's' : ''}</p>
            )}
            <p>Your answer: <span className="font-medium">{answer || '(skipped)'}</span></p>
            <p>Correct answer: <span className="font-bold text-green-700">{current.phrase}</span></p>
          </div>
          <div className="bg-white border rounded-lg p-4 space-y-2">
            <p><span className="text-gray-500">Example:</span> {current.example}</p>
            {current.translation && <p className="text-gray-600 text-sm">{current.translation}</p>}
            <p><span className="text-gray-500">Meaning:</span> {current.meaning}</p>
            {current.memo && <p><span className="text-gray-500">Memo:</span> {current.memo}</p>}
          </div>
          <button onClick={() => goNext()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
            {index + 1 >= phrases.length ? 'See Results' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContent />
    </Suspense>
  )
}
