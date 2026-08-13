-- AlterEnum
ALTER TYPE "JobStatus" ADD VALUE 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "amountDue" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'ZMW',
ADD COLUMN     "pricingPlan" TEXT NOT NULL DEFAULT 'LAUNCH_OFFER',
ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT',
ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING_PAYMENT';

-- CreateTable
CREATE TABLE "PaymentSubmission" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 50,
    "currency" TEXT NOT NULL DEFAULT 'ZMW',
    "paymentMethod" TEXT NOT NULL,
    "transactionReference" TEXT NOT NULL,
    "payerPhone" TEXT,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentSubmission" ADD CONSTRAINT "PaymentSubmission_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSubmission" ADD CONSTRAINT "PaymentSubmission_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "EmployerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
