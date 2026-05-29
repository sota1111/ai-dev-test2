export type MatchType = 'exact' | 'normalized' | 'incorrect'

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.,!?;:]+$/, '')
    .replace(/'/g, "'")
}

export function checkAnswer(userAnswer: string, correctAnswer: string): MatchType {
  if (userAnswer === correctAnswer) return 'exact'
  if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) return 'exact'
  if (normalize(userAnswer) === normalize(correctAnswer)) return 'normalized'
  return 'incorrect'
}

export function isCorrect(userAnswer: string, correctAnswer: string): boolean {
  const result = checkAnswer(userAnswer, correctAnswer)
  return result === 'exact' || result === 'normalized'
}

export function buildBlank(example: string, phrase: string): string {
  const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  return example.replace(regex, '_______')
}
