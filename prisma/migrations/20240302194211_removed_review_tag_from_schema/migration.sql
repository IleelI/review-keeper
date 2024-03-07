/*
  Warnings:

  - You are about to drop the `ReviewTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ReviewToReviewTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ReviewTag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ReviewToReviewTag";
PRAGMA foreign_keys=on;
