-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

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
    "prevBalance" INTEGER NOT NULL,
    "changeAmount" INTEGER NOT NULL,
    "newBalance" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "prevAccountDetailId" INTEGER,

    CONSTRAINT "account_detail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_detail_prevAccountDetailId_key" ON "account_detail"("prevAccountDetailId");

-- AddForeignKey
ALTER TABLE "account_detail" ADD CONSTRAINT "account_detail_prevAccountDetailId_fkey" FOREIGN KEY ("prevAccountDetailId") REFERENCES "account_detail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
