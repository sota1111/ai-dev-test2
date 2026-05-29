import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const phrase = await prisma.phrase.findUnique({ where: { id } })
  if (!phrase) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const updated = await prisma.phrase.update({
    where: { id },
    data: { isFavorite: !phrase.isFavorite }
  })
  return NextResponse.json({ isFavorite: updated.isFavorite })
}
