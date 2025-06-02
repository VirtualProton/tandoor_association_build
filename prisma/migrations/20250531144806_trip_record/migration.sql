/*
  Warnings:

  - You are about to alter the column `dateOfLease` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expiryOfLease` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `dateOfRenewal` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fromDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `toDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tripDate` on the `trip_record` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `taxinvoice` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tripId]` on the table `trip_record` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tripId` to the `trip_record` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `taxinvoice` DROP FOREIGN KEY `TaxInvoice_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `taxinvoice` DROP FOREIGN KEY `TaxInvoice_membershipId_fkey`;

-- DropForeignKey
ALTER TABLE `taxinvoice` DROP FOREIGN KEY `TaxInvoice_modifiedBy_fkey`;

-- AlterTable
ALTER TABLE `lease_queries` MODIFY `dateOfLease` DATETIME NOT NULL,
    MODIFY `expiryOfLease` DATETIME NOT NULL,
    MODIFY `dateOfRenewal` DATETIME NULL;

-- AlterTable
ALTER TABLE `member_billing_history` MODIFY `fromDate` DATETIME NOT NULL,
    MODIFY `toDate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `trip_record` ADD COLUMN `createdBy` INTEGER NULL,
    ADD COLUMN `modifiedBy` INTEGER NULL,
    ADD COLUMN `tripId` VARCHAR(225) NOT NULL,
    MODIFY `tripDate` DATETIME NOT NULL;

-- DropTable
DROP TABLE `taxinvoice`;

-- CreateTable
CREATE TABLE `TripIdTracker` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `year` INTEGER NOT NULL,
    `counter` INTEGER NOT NULL,

    UNIQUE INDEX `TripIdTracker_year_key`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tax_invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceId` VARCHAR(225) NOT NULL,
    `membershipId` VARCHAR(225) NOT NULL,
    `invoiceDate` DATETIME(3) NOT NULL,
    `hsnCode` VARCHAR(225) NOT NULL,
    `particular` TEXT NOT NULL,
    `stoneCount` INTEGER NOT NULL,
    `size` DECIMAL(10, 2) NOT NULL,
    `totalSqFeet` DECIMAL(10, 2) NOT NULL,
    `ratePerSqFeet` DECIMAL(10, 2) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `cGSTInPercent` INTEGER NOT NULL,
    `sGSTInPercent` INTEGER NOT NULL,
    `iGSTInPercent` INTEGER NOT NULL,
    `subTotal` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `modifiedBy` INTEGER NULL,

    UNIQUE INDEX `tax_invoice_invoiceId_key`(`invoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `trip_record_tripId_key` ON `trip_record`(`tripId`);

-- AddForeignKey
ALTER TABLE `trip_record` ADD CONSTRAINT `trip_record_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_record` ADD CONSTRAINT `trip_record_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tax_invoice` ADD CONSTRAINT `tax_invoice_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tax_invoice` ADD CONSTRAINT `tax_invoice_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tax_invoice` ADD CONSTRAINT `tax_invoice_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;
