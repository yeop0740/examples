-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_detail" (
    "id" SERIAL NOT NULL,
    "prev_balance" INTEGER NOT NULL,
    "change_amount" INTEGER NOT NULL,
    "new_balance" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "account_detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "account_detail" ADD CONSTRAINT "account_detail_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
