import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const phrase = await prisma.phrase.findUnique({
    where: { id: params.id },
    include: { records: true },
  })
  if (!phrase) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const total = phrase.records.length
  const correct = phrase.records.filter(r => r.isCorrect).length
  return NextResponse.json({
    ...phrase,
    totalCount: total,
    correctCount: correct,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : null,
  })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const phrase = await prisma.phrase.update({ where: { id: params.id }, data: body })
  return NextResponse.json(phrase)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await prisma.phrase.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
