/*
  Warnings:

  - You are about to alter the column `dateOfLease` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expiryOfLease` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `dateOfRenewal` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fromDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `toDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `amount` on the `tax_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `hsnCode` on the `tax_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `particular` on the `tax_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `ratePerSqFeet` on the `tax_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `tax_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `stoneCount` on the `tax_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `totalSqFeet` on the `tax_invoice` table. All the data in the column will be lost.
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
ALTER TABLE `tax_invoice` DROP COLUMN `amount`,
    DROP COLUMN `hsnCode`,
    DROP COLUMN `particular`,
    DROP COLUMN `ratePerSqFeet`,
    DROP COLUMN `size`,
    DROP COLUMN `stoneCount`,
    DROP COLUMN `totalSqFeet`;

-- AlterTable
ALTER TABLE `trip_record` MODIFY `tripDate` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `invoice_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceId` VARCHAR(225) NOT NULL,
    `hsnCode` VARCHAR(225) NOT NULL,
    `particular` TEXT NOT NULL,
    `stoneCount` INTEGER NOT NULL,
    `size` DECIMAL(10, 2) NOT NULL,
    `totalSqFeet` DECIMAL(10, 2) NOT NULL,
    `ratePerSqFeet` DECIMAL(10, 2) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `invoice_item` ADD CONSTRAINT `invoice_item_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `tax_invoice`(`invoiceId`) ON DELETE CASCADE ON UPDATE CASCADE;
