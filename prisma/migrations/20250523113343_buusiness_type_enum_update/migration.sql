/*
  Warnings:

  - You are about to alter the column `fromDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `toDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - The values [TRADING,OTHER] on the enum `members_proprietorType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `tripDate` on the `trip_record` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `member_billing_history` MODIFY `fromDate` DATETIME NOT NULL,
    MODIFY `toDate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `members` MODIFY `proprietorType` ENUM('OWNED', 'RENTED', 'TRADER', 'FACTORY_GIVEN_ON_LEASE') NOT NULL DEFAULT 'OWNED';

-- AlterTable
ALTER TABLE `trip_record` MODIFY `tripDate` DATETIME NOT NULL;
