/*
  Warnings:

  - You are about to drop the column `accountId` on the `account_detail` table. All the data in the column will be lost.
  - You are about to drop the column `changeAmount` on the `account_detail` table. All the data in the column will be lost.
  - You are about to drop the column `newBalance` on the `account_detail` table. All the data in the column will be lost.
  - You are about to drop the column `prevBalance` on the `account_detail` table. All the data in the column will be lost.
  - Added the required column `account_id` to the `account_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `change_amount` to the `account_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `new_balance` to the `account_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prev_balance` to the `account_detail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "account_detail" DROP CONSTRAINT "account_detail_accountId_fkey";

-- AlterTable
ALTER TABLE "account_detail" DROP COLUMN "accountId",
DROP COLUMN "changeAmount",
DROP COLUMN "newBalance",
DROP COLUMN "prevBalance",
ADD COLUMN     "account_id" INTEGER NOT NULL,
ADD COLUMN     "change_amount" INTEGER NOT NULL,
ADD COLUMN     "new_balance" INTEGER NOT NULL,
ADD COLUMN     "prev_balance" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "account_detail" ADD CONSTRAINT "account_detail_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
