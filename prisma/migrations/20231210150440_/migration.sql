-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('Close', 'Open');

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "qustionDescription" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);
