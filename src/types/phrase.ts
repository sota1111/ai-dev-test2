export interface Phrase {
  id: string
  phrase: string
  meaning: string
  example: string
  translation: string
  category: string
  memo: string
  difficulty: string
  createdAt: string
  updatedAt: string
  accuracy?: number
  totalCount?: number
  correctCount?: number
  lastReviewedAt?: string | null
}

export interface PhraseFormData {
  phrase: string
  meaning: string
  example: string
  translation: string
  category: string
  memo: string
  difficulty: string
}
