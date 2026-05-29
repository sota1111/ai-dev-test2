import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const phrases = await prisma.phrase.findMany({
    include: { records: true }
  })

  const totalPhrases = phrases.length
  const unreviewedCount = phrases.filter(p => p.records.length === 0).length
  const allRecords = phrases.flatMap(p => p.records)
  const totalReviews = allRecords.length
  const overallAccuracy = totalReviews === 0
    ? null
    : Math.round(allRecords.filter(r => r.isCorrect).length / totalReviews * 100)

  // Category stats
  const categoryMap: Record<string, { total: number; correct: number }> = {}
  for (const p of phrases) {
    if (!categoryMap[p.category]) categoryMap[p.category] = { total: 0, correct: 0 }
    categoryMap[p.category].total += p.records.length
    categoryMap[p.category].correct += p.records.filter(r => r.isCorrect).length
  }
  const categoryStats = Object.entries(categoryMap).map(([category, s]) => ({
    category,
    total: s.total,
    correct: s.correct,
    accuracy: s.total === 0 ? null : Math.round(s.correct / s.total * 100),
  }))

  // Difficulty stats
  const difficultyMap: Record<string, { total: number; correct: number }> = {}
  for (const p of phrases) {
    if (!difficultyMap[p.difficulty]) difficultyMap[p.difficulty] = { total: 0, correct: 0 }
    difficultyMap[p.difficulty].total += p.records.length
    difficultyMap[p.difficulty].correct += p.records.filter(r => r.isCorrect).length
  }
  const difficultyStats = Object.entries(difficultyMap).map(([difficulty, s]) => ({
    difficulty,
    total: s.total,
    correct: s.correct,
    accuracy: s.total === 0 ? null : Math.round(s.correct / s.total * 100),
  }))

  // Last 7 days reviews
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)
  const last7Days: { date: string; count: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const count = allRecords.filter(r => {
      const rec = new Date(r.answeredAt)
      return rec.toISOString().slice(0, 10) === dateStr
    }).length
    last7Days.push({ date: dateStr, count })
  }

  // Top weak phrases (most incorrect answers)
  const phraseStats = phrases
    .filter(p => p.records.length > 0)
    .map(p => ({
      id: p.id,
      phrase: p.phrase,
      meaning: p.meaning,
      category: p.category,
      total: p.records.length,
      incorrect: p.records.filter(r => !r.isCorrect).length,
      accuracy: Math.round(p.records.filter(r => r.isCorrect).length / p.records.length * 100),
    }))
    .sort((a, b) => b.incorrect - a.incorrect)
    .slice(0, 10)

  return NextResponse.json({
    totalPhrases,
    unreviewedCount,
    totalReviews,
    overallAccuracy,
    categoryStats,
    difficultyStats,
    last7Days,
    topWeakPhrases: phraseStats,
  })
}
