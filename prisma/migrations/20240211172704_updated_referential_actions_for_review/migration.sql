/*
  Warnings:

  - You are about to drop the column `cateogryId` on the `Review` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER,
    "ratingScale" INTEGER,
    "categoryId" INTEGER,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Review_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ReviewCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("authorId", "content", "id", "rating", "title") SELECT "authorId", "content", "id", "rating", "title" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
