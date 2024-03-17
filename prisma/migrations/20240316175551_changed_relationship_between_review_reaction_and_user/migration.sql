/*
  Warnings:

  - You are about to drop the `ReviewReactionType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "ReviewReactionType_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ReviewReactionType";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ReactionType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReviewReaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "typeId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ReviewReaction_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ReactionType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReviewReaction_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReviewReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReviewReaction" ("createdAt", "id", "reviewId", "typeId", "updatedAt", "userId") SELECT "createdAt", "id", "reviewId", "typeId", "updatedAt", "userId" FROM "ReviewReaction";
DROP TABLE "ReviewReaction";
ALTER TABLE "new_ReviewReaction" RENAME TO "ReviewReaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ReactionType_name_key" ON "ReactionType"("name");
