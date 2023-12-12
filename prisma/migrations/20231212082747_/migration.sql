/*
  Warnings:

  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'Request';

-- DropTable
DROP TABLE "Question";

-- CreateTable
CREATE TABLE "question" (
    "id" SERIAL NOT NULL,
    "questionDescription" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);
