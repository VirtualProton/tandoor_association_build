/*
  Warnings:

  - You are about to drop the column `onBench` on the `labour_history` table. All the data in the column will be lost.
  - You are about to alter the column `dateOfLease` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expiryOfLease` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `dateOfRenewal` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fromDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `toDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tripDate` on the `trip_record` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `labourStatus` to the `labour_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `labour_history` DROP COLUMN `onBench`,
    ADD COLUMN `labourStatus` ENUM('ACTIVE', 'INACTIVE', 'ON_BENCH') NOT NULL;

-- AlterTable
ALTER TABLE `labours` MODIFY `labourStatus` ENUM('ACTIVE', 'INACTIVE', 'ON_BENCH') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `lease_queries` MODIFY `dateOfLease` DATETIME NOT NULL,
    MODIFY `expiryOfLease` DATETIME NOT NULL,
    MODIFY `dateOfRenewal` DATETIME NULL;

-- AlterTable
ALTER TABLE `member_billing_history` MODIFY `fromDate` DATETIME NOT NULL,
    MODIFY `toDate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `trip_record` MODIFY `tripDate` DATETIME NOT NULL;
