/*
  Warnings:

  - You are about to alter the column `dateOfLease` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expiryOfLease` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `dateOfRenewal` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fromDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `toDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tripDate` on the `trip_record` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `lease_queries` MODIFY `dateOfLease` DATETIME NOT NULL,
    MODIFY `expiryOfLease` DATETIME NOT NULL,
    MODIFY `dateOfRenewal` DATETIME NULL;

-- AlterTable
ALTER TABLE `member_billing_history` MODIFY `fromDate` DATETIME NOT NULL,
    MODIFY `toDate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `trip_record` MODIFY `tripDate` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `LeaseQueryHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `leaseQueryId` VARCHAR(225) NOT NULL,
    `membershipId` VARCHAR(225) NOT NULL,
    `fromDate` DATETIME NOT NULL,
    `toDate` DATETIME NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LeaseQueryHistory` ADD CONSTRAINT `LeaseQueryHistory_leaseQueryId_fkey` FOREIGN KEY (`leaseQueryId`) REFERENCES `lease_queries`(`leaseQueryId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaseQueryHistory` ADD CONSTRAINT `LeaseQueryHistory_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;
