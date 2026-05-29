-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LearningRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phraseId" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "hintCount" INTEGER NOT NULL DEFAULT 0,
    "userAnswer" TEXT NOT NULL DEFAULT '',
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "answeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearningRecord_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "Phrase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LearningRecord" ("answeredAt", "id", "isCorrect", "phraseId") SELECT "answeredAt", "id", "isCorrect", "phraseId" FROM "LearningRecord";
DROP TABLE "LearningRecord";
ALTER TABLE "new_LearningRecord" RENAME TO "LearningRecord";
CREATE TABLE "new_Phrase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phrase" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "example" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'other',
    "memo" TEXT NOT NULL DEFAULT '',
    "difficulty" TEXT NOT NULL DEFAULT 'normal',
    "nextReviewDate" DATETIME,
    "reviewInterval" INTEGER NOT NULL DEFAULT 1,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Phrase" ("category", "createdAt", "difficulty", "example", "id", "meaning", "memo", "nextReviewDate", "phrase", "reviewInterval", "translation", "updatedAt") SELECT "category", "createdAt", "difficulty", "example", "id", "meaning", "memo", "nextReviewDate", "phrase", "reviewInterval", "translation", "updatedAt" FROM "Phrase";
DROP TABLE "Phrase";
ALTER TABLE "new_Phrase" RENAME TO "Phrase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
