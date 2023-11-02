/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UseronGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UseronGroup" DROP CONSTRAINT "UseronGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UseronGroup" DROP CONSTRAINT "UseronGroup_userId_fkey";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UseronGroup";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "index_umk" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_index_umk_key" ON "user"("index_umk");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
