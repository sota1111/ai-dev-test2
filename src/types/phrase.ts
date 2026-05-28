export interface Phrase {
  id: string
  phrase: string
  meaning: string
  example: string
  translation: string
  category: string
  memo: string
  difficulty: string
  nextReviewDate?: string | null
  reviewInterval?: number
  createdAt: string
  updatedAt: string
}

export interface LearningRecord {
  id: string
  phraseId: string
  isCorrect: boolean
  answeredAt: string
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
