/*
  Warnings:

  - You are about to drop the `UserAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserQuiz` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserAnswer" DROP CONSTRAINT "UserAnswer_userQuizId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_userQuizId_fkey";

-- DropTable
DROP TABLE "UserAnswer";

-- DropTable
DROP TABLE "UserQuiz";

-- CreateTable
CREATE TABLE "userQuiz" (
    "id" SERIAL NOT NULL,
    "startQuiz" TIMESTAMP(3) NOT NULL,
    "isOpen" BOOLEAN NOT NULL,

    CONSTRAINT "userQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userAnswer" (
    "id" SERIAL NOT NULL,
    "answer" TEXT NOT NULL,
    "userQuizId" INTEGER NOT NULL,

    CONSTRAINT "userAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_userQuizId_fkey" FOREIGN KEY ("userQuizId") REFERENCES "userQuiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAnswer" ADD CONSTRAINT "userAnswer_userQuizId_fkey" FOREIGN KEY ("userQuizId") REFERENCES "userQuiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
