import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('mode') || 'all'
  const category = searchParams.get('category') || ''
  const difficulty = searchParams.get('difficulty') || ''
  const incorrectIds = searchParams.get('incorrectIds') || ''

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
    } else {
      phrases = allPhrases
    }

    phrases = phrases.map(p => ({ ...p, records: undefined }))
  }

  const shuffled = phrases.sort(() => Math.random() - 0.5)
  return NextResponse.json(shuffled)
}
