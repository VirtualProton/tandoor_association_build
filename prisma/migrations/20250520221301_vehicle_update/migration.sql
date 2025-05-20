/*
  Warnings:

  - You are about to alter the column `fromDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `toDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `emailId` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `vehicles` table. All the data in the column will be lost.
  - Added the required column `driverName` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driverPhoneNumber` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerPhoneNumber` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `member_billing_history` MODIFY `fromDate` DATETIME NOT NULL,
    MODIFY `toDate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `vehicles` DROP COLUMN `emailId`,
    DROP COLUMN `isActive`,
    DROP COLUMN `phoneNumber`,
    ADD COLUMN `driverName` VARCHAR(50) NOT NULL,
    ADD COLUMN `driverPhoneNumber` VARCHAR(13) NOT NULL,
    ADD COLUMN `ownerPhoneNumber` VARCHAR(13) NOT NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE') NOT NULL DEFAULT 'ACTIVE';
