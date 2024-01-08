-- CreateTable
CREATE TABLE "_GroupToQuestion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToQuestion_AB_unique" ON "_GroupToQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToQuestion_B_index" ON "_GroupToQuestion"("B");

-- AddForeignKey
ALTER TABLE "_GroupToQuestion" ADD CONSTRAINT "_GroupToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToQuestion" ADD CONSTRAINT "_GroupToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
