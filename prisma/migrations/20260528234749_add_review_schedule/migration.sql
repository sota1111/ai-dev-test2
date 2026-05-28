-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Phrase" ("category", "createdAt", "difficulty", "example", "id", "meaning", "memo", "phrase", "translation", "updatedAt") SELECT "category", "createdAt", "difficulty", "example", "id", "meaning", "memo", "phrase", "translation", "updatedAt" FROM "Phrase";
DROP TABLE "Phrase";
ALTER TABLE "new_Phrase" RENAME TO "Phrase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
