/*
  Warnings:

  - You are about to alter the column `fromDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `toDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropIndex
DROP INDEX `members_membershipId_electricalUscNumber_scNumber_idx` ON `members`;

-- AlterTable
ALTER TABLE `member_billing_history` MODIFY `fromDate` DATETIME NOT NULL,
    MODIFY `toDate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `members` ALTER COLUMN `doj` DROP DEFAULT;

-- CreateIndex
CREATE INDEX `members_id_membershipId_electricalUscNumber_scNumber_idx` ON `members`(`id`, `membershipId`, `electricalUscNumber`, `scNumber`);
