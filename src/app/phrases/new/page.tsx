'use client'
import { useRouter } from 'next/navigation'
import PhraseForm from '@/components/PhraseForm'

export default function NewPhrasePage() {
  const router = useRouter()

  const handleSubmit = async (data: Record<string, string>) => {
    const res = await fetch('/api/phrases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create phrase')
    router.push('/phrases')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Phrase</h1>
      <PhraseForm onSubmit={handleSubmit} submitLabel="Add Phrase" />
    </div>
  )
}
