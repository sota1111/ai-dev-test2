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
  return NextResponse.json(record, { status: 201 })
}
