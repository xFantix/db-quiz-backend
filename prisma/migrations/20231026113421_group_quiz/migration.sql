-- CreateTable
CREATE TABLE "GroupQuiz" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startQuiz" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupQuizToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupQuiz_name_key" ON "GroupQuiz"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupQuizToUser_AB_unique" ON "_GroupQuizToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupQuizToUser_B_index" ON "_GroupQuizToUser"("B");

-- AddForeignKey
ALTER TABLE "_GroupQuizToUser" ADD CONSTRAINT "_GroupQuizToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "GroupQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupQuizToUser" ADD CONSTRAINT "_GroupQuizToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
