import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const records = await prisma.learningRecord.findMany({
    include: { phrase: true },
    orderBy: { answeredAt: 'desc' },
    take: 500,
  })

  const grouped: Record<string, object[]> = {}
  for (const r of records) {
    const dateStr = new Date(r.answeredAt).toISOString().slice(0, 10)
    if (!grouped[dateStr]) grouped[dateStr] = []
    grouped[dateStr].push({
      id: r.id,
      phraseId: r.phraseId,
      phraseText: r.phrase.phrase,
      meaning: r.phrase.meaning,
      isCorrect: r.isCorrect,
      hintCount: r.hintCount,
      userAnswer: r.userAnswer,
      skipped: r.skipped,
      answeredAt: r.answeredAt,
    })
  }

  const result = Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, recs]) => ({ date, records: recs }))

  return NextResponse.json(result)
}
