/*
  Warnings:

  - Made the column `time` on table `group` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "group" ALTER COLUMN "time" SET NOT NULL;
