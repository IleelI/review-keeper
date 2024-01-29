-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER,
    "cateogryId" INTEGER,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Review_cateogryId_fkey" FOREIGN KEY ("cateogryId") REFERENCES "ReviewCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewReactionType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ReviewReaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reviewId" INTEGER NOT NULL,
    CONSTRAINT "ReviewReaction_id_fkey" FOREIGN KEY ("id") REFERENCES "ReviewReactionType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReviewReaction_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ReviewTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ReviewToReviewTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ReviewToReviewTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ReviewToReviewTag_B_fkey" FOREIGN KEY ("B") REFERENCES "ReviewTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewReactionType_name_key" ON "ReviewReactionType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewCategory_name_key" ON "ReviewCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewTag_name_key" ON "ReviewTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ReviewToReviewTag_AB_unique" ON "_ReviewToReviewTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ReviewToReviewTag_B_index" ON "_ReviewToReviewTag"("B");
