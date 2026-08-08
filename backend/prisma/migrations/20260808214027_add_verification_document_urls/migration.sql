-- AlterTable
ALTER TABLE "Application" ADD COLUMN "cvFileUrl" TEXT;

-- AlterTable
ALTER TABLE "EmployerVerification" ADD COLUMN "authorizationLetterFileUrl" TEXT;
ALTER TABLE "EmployerVerification" ADD COLUMN "businessRegistrationFileUrl" TEXT;
ALTER TABLE "EmployerVerification" ADD COLUMN "taxDocumentFileUrl" TEXT;
