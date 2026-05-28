'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhraseForm from '@/components/PhraseForm'

export default function EditPhrasePage({ params }: { params: { id: string } }) {
  const [phrase, setPhrase] = useState<Record<string, string> | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/phrases/' + params.id).then(r => r.json()).then(setPhrase)
  }, [params.id])

  const handleSubmit = async (data: Record<string, string>) => {
    const res = await fetch('/api/phrases/' + params.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update phrase')
    router.push('/phrases/' + params.id)
  }

  if (!phrase) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Phrase</h1>
      <PhraseForm initialData={phrase} onSubmit={handleSubmit} submitLabel="Update Phrase" />
    </div>
  )
}
