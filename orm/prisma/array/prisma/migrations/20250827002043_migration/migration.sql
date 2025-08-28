-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "images" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
