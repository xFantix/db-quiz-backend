/*
  Warnings:

  - Added the required column `counter` to the `userQuiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `points` to the `userQuiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userQuiz" ADD COLUMN     "counter" INTEGER NOT NULL,
ADD COLUMN     "points" INTEGER NOT NULL;
