/*
  Warnings:

  - You are about to drop the `GroupQuiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UseronGroupQuiz` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UseronGroupQuiz" DROP CONSTRAINT "UseronGroupQuiz_groupQuizId_fkey";

-- DropForeignKey
ALTER TABLE "UseronGroupQuiz" DROP CONSTRAINT "UseronGroupQuiz_userId_fkey";

-- DropTable
DROP TABLE "GroupQuiz";

-- DropTable
DROP TABLE "UseronGroupQuiz";

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startTimeQuiz" TIMESTAMP(3) NOT NULL,
    "endTimeQuiz" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UseronGroup" (
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "UseronGroup_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- AddForeignKey
ALTER TABLE "UseronGroup" ADD CONSTRAINT "UseronGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UseronGroup" ADD CONSTRAINT "UseronGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
