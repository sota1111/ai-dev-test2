import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('mode') || 'all'
  const category = searchParams.get('category') || ''
  const difficulty = searchParams.get('difficulty') || ''
  const incorrectIds = searchParams.get('incorrectIds') || ''
  const countOnly = searchParams.get('countOnly') === 'true'
  const limitParam = searchParams.get('limit') || ''
  const order = searchParams.get('order') || 'random'

  let phrases

  if (mode === 'incorrect' && incorrectIds) {
    const ids = incorrectIds.split(',').filter(Boolean)
    phrases = await prisma.phrase.findMany({ where: { id: { in: ids } } })
  } else {
    const allPhrases = await prisma.phrase.findMany({
      where: {
        AND: [
          category ? { category } : {},
          difficulty ? { difficulty } : {},
        ]
      },
      include: { records: true }
    })

    if (mode === 'unreviewed') {
      phrases = allPhrases.filter(p => p.records.length === 0)
    } else if (mode === 'weak') {
      phrases = allPhrases.filter(p => {
        if (p.records.length === 0) return false
        const correct = p.records.filter(r => r.isCorrect).length
        return (correct / p.records.length) < 0.5
      })
    } else if (mode === 'schedule') {
      const todayEnd = new Date()
      todayEnd.setHours(23, 59, 59, 999)
      phrases = allPhrases.filter(p =>
        p.nextReviewDate === null || p.nextReviewDate <= todayEnd
      )
    } else if (mode === 'favorite') {
      phrases = allPhrases.filter(p => p.isFavorite)
    } else {
      phrases = allPhrases
    }

    if (countOnly) {
      return NextResponse.json({ count: phrases.length })
    }

    if (order === 'accuracy_asc') {
      phrases = phrases.sort((a, b) => {
        const accA = a.records.length === 0 ? -1 : a.records.filter(r => r.isCorrect).length / a.records.length
        const accB = b.records.length === 0 ? -1 : b.records.filter(r => r.isCorrect).length / b.records.length
        return accA - accB
      })
    } else if (order === 'oldest') {
      phrases = phrases.sort((a, b) => {
        const lastA = a.records.length === 0 ? 0 : Math.max(...a.records.map(r => new Date(r.answeredAt).getTime()))
        const lastB = b.records.length === 0 ? 0 : Math.max(...b.records.map(r => new Date(r.answeredAt).getTime()))
        return lastA - lastB
      })
    } else {
      phrases = phrases.sort(() => Math.random() - 0.5)
    }

    phrases = phrases.map(p => ({ ...p, records: undefined }))
  }

  if (limitParam && limitParam !== 'all') {
    const n = parseInt(limitParam, 10)
    if (!isNaN(n) && n > 0) {
      phrases = phrases.slice(0, n)
    }
  }

  return NextResponse.json(phrases)
}
