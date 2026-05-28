import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { phraseId, isCorrect } = body
  if (!phraseId || isCorrect === undefined) {
    return NextResponse.json({ error: 'phraseId and isCorrect required' }, { status: 400 })
  }

  const record = await prisma.learningRecord.create({
    data: { phraseId, isCorrect }
  })

  const phrase = await prisma.phrase.findUnique({ where: { id: phraseId } })
  if (phrase) {
    const currentInterval = phrase.reviewInterval ?? 1
    const newInterval = isCorrect
      ? Math.min(currentInterval * 2, 365)
      : 1
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)
    nextReviewDate.setHours(0, 0, 0, 0)

    await prisma.phrase.update({
      where: { id: phraseId },
      data: { reviewInterval: newInterval, nextReviewDate },
    })
  }

  return NextResponse.json(record, { status: 201 })
}
