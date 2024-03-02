/*
  Warnings:

  - The primary key for the `ReviewReaction` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReviewReaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "typeId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    CONSTRAINT "ReviewReaction_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ReviewReactionType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReviewReaction_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReviewReaction" ("id", "reviewId", "typeId") SELECT "id", "reviewId", "typeId" FROM "ReviewReaction";
DROP TABLE "ReviewReaction";
ALTER TABLE "new_ReviewReaction" RENAME TO "ReviewReaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
