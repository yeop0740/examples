/*
  Warnings:

  - You are about to drop the column `prevAccountDetailId` on the `account_detail` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prev_account_detail_id]` on the table `account_detail` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "account_detail" DROP CONSTRAINT "account_detail_prevAccountDetailId_fkey";

-- DropIndex
DROP INDEX "account_detail_prevAccountDetailId_key";

-- AlterTable
ALTER TABLE "account_detail" DROP COLUMN "prevAccountDetailId",
ADD COLUMN     "prev_account_detail_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "account_detail_prev_account_detail_id_key" ON "account_detail"("prev_account_detail_id");

-- AddForeignKey
ALTER TABLE "account_detail" ADD CONSTRAINT "account_detail_prev_account_detail_id_fkey" FOREIGN KEY ("prev_account_detail_id") REFERENCES "account_detail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
