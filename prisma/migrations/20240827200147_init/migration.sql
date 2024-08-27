-- CreateTable
CREATE TABLE "Measure" (
    "measure_uuid" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Measure_pkey" PRIMARY KEY ("measure_uuid")
);
