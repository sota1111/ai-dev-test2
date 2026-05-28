import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const difficulty = searchParams.get('difficulty') || ''

  const phrases = await prisma.phrase.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { phrase: { contains: q } },
            { meaning: { contains: q } },
            { example: { contains: q } },
            { category: { contains: q } },
            { memo: { contains: q } },
          ]
        } : {},
        category ? { category } : {},
        difficulty ? { difficulty } : {},
      ]
    },
    include: { records: true },
    orderBy: { createdAt: 'desc' },
  })

  const result = phrases.map(p => {
    const total = p.records.length
    const correct = p.records.filter(r => r.isCorrect).length
    const lastRecord = p.records.sort((a, b) => 
      new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime()
    )[0]
    return {
      ...p,
      totalCount: total,
      correctCount: correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : null,
      lastReviewedAt: lastRecord ? lastRecord.answeredAt : null,
      records: undefined,
    }
  })

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const phrase = await prisma.phrase.create({ data: body })
  return NextResponse.json(phrase, { status: 201 })
}
