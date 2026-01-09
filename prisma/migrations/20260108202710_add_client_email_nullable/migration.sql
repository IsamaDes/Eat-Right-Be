-- DropIndex
DROP INDEX "Subscription_subscriberId_key";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "clientEmail" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Subscription_subscriberId_status_idx" ON "Subscription"("subscriberId", "status");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");
