/*
  Warnings:

  - You are about to drop the `_GroupQuizToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GroupQuizToUser" DROP CONSTRAINT "_GroupQuizToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupQuizToUser" DROP CONSTRAINT "_GroupQuizToUser_B_fkey";

-- DropTable
DROP TABLE "_GroupQuizToUser";

-- CreateTable
CREATE TABLE "UseronGroupQuiz" (
    "userId" INTEGER NOT NULL,
    "groupQuizId" INTEGER NOT NULL,

    CONSTRAINT "UseronGroupQuiz_pkey" PRIMARY KEY ("userId","groupQuizId")
);

-- AddForeignKey
ALTER TABLE "UseronGroupQuiz" ADD CONSTRAINT "UseronGroupQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UseronGroupQuiz" ADD CONSTRAINT "UseronGroupQuiz_groupQuizId_fkey" FOREIGN KEY ("groupQuizId") REFERENCES "GroupQuiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
