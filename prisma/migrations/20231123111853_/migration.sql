-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_groupId_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "groupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
