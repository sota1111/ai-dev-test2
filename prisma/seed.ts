import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const phrases = [
    { phrase: 'take care of', meaning: 'to deal with or look after', example: 'I need to take care of this issue today.', translation: 'today I must handle this.', category: 'daily', difficulty: 'normal', memo: 'very common phrase' },
    { phrase: 'be responsible for', meaning: 'to be in charge of', example: 'She is responsible for managing the project.', translation: 'she manages the project.', category: 'business', difficulty: 'normal', memo: '' },
    { phrase: 'in terms of', meaning: 'with regard to', example: 'In terms of cost, this option is better.', translation: 'cost-wise this is better.', category: 'business', difficulty: 'normal', memo: '' },
    { phrase: 'look forward to', meaning: 'to anticipate eagerly', example: 'I look forward to hearing from you.', translation: 'I await your reply.', category: 'email', difficulty: 'easy', memo: 'common in emails' },
    { phrase: 'get along with', meaning: 'to have a good relationship', example: 'She gets along well with her colleagues.', translation: 'she has good relations with coworkers.', category: 'daily', difficulty: 'normal', memo: '' },
    { phrase: 'come up with', meaning: 'to think of an idea', example: 'We need to come up with a new solution.', translation: 'we must find a new answer.', category: 'daily', difficulty: 'normal', memo: '' },
    { phrase: 'depend on', meaning: 'to rely on', example: 'The result depends on many factors.', translation: 'the outcome relies on many things.', category: 'daily', difficulty: 'easy', memo: '' },
    { phrase: 'be familiar with', meaning: 'to know well', example: 'Are you familiar with this software?', translation: 'do you know this software well?', category: 'business', difficulty: 'normal', memo: '' },
    { phrase: 'according to', meaning: 'as stated by', example: 'According to the report, sales increased.', translation: 'the report says sales went up.', category: 'connector', difficulty: 'easy', memo: '' },
    { phrase: 'instead of', meaning: 'in place of', example: 'Use this method instead of the old one.', translation: 'use this rather than the old way.', category: 'connector', difficulty: 'easy', memo: '' },
  ]
  for (const p of phrases) {
    const existing = await prisma.phrase.findFirst({ where: { phrase: p.phrase } })
    if (!existing) {
      await prisma.phrase.create({ data: p })
    }
  }
  console.log('Seeded', phrases.length, 'phrases')
}
main().catch(console.error).finally(() => prisma.$disconnect())
