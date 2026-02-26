/*
  Warnings:

  - Added the required column `accountId` to the `account_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "account_detail" ADD COLUMN     "accountId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "account_detail" ADD CONSTRAINT "account_detail_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
