/*
  Warnings:

  - You are about to drop the column `startQuiz` on the `GroupQuiz` table. All the data in the column will be lost.
  - Added the required column `endTimeQuiz` to the `GroupQuiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTimeQuiz` to the `GroupQuiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupQuiz" DROP COLUMN "startQuiz",
ADD COLUMN     "endTimeQuiz" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTimeQuiz" TIMESTAMP(3) NOT NULL;
