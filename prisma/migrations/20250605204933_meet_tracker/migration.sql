/*
  Warnings:

  - You are about to drop the column `meetingId` on the `follow_up_meetings` table. All the data in the column will be lost.
  - You are about to alter the column `dateOfLease` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expiryOfLease` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `dateOfRenewal` on the `lease_queries` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `meetingId` on the `meeting_attendees` table. All the data in the column will be lost.
  - The primary key for the `meetings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `meetings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `fromDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `toDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tripDate` on the `trip_record` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[meetId,membershipId,vehicleId]` on the table `meeting_attendees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[meetId]` on the table `meetings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `meetId` to the `follow_up_meetings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meetId` to the `meeting_attendees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meetId` to the `meetings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `follow_up_meetings` DROP FOREIGN KEY `follow_up_meetings_meetingId_fkey`;

-- DropForeignKey
ALTER TABLE `meeting_attendees` DROP FOREIGN KEY `meeting_attendees_meetingId_fkey`;

-- DropIndex
DROP INDEX `follow_up_meetings_meetingId_fkey` ON `follow_up_meetings`;

-- DropIndex
DROP INDEX `meeting_attendees_meetingId_membershipId_vehicleId_key` ON `meeting_attendees`;

-- AlterTable
ALTER TABLE `follow_up_meetings` DROP COLUMN `meetingId`,
    ADD COLUMN `meetId` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `lease_queries` MODIFY `dateOfLease` DATETIME NOT NULL,
    MODIFY `expiryOfLease` DATETIME NOT NULL,
    MODIFY `dateOfRenewal` DATETIME NULL;

-- AlterTable
ALTER TABLE `meeting_attendees` DROP COLUMN `meetingId`,
    ADD COLUMN `meetId` VARCHAR(225) NOT NULL;

-- AlterTable
ALTER TABLE `meetings` DROP PRIMARY KEY,
    ADD COLUMN `meetId` VARCHAR(255) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `member_billing_history` MODIFY `fromDate` DATETIME NOT NULL,
    MODIFY `toDate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `trip_record` MODIFY `tripDate` DATETIME NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `meeting_attendees_meetId_membershipId_vehicleId_key` ON `meeting_attendees`(`meetId`, `membershipId`, `vehicleId`);

-- CreateIndex
CREATE UNIQUE INDEX `meetings_meetId_key` ON `meetings`(`meetId`);

-- AddForeignKey
ALTER TABLE `follow_up_meetings` ADD CONSTRAINT `follow_up_meetings_meetId_fkey` FOREIGN KEY (`meetId`) REFERENCES `meetings`(`meetId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_attendees` ADD CONSTRAINT `meeting_attendees_meetId_fkey` FOREIGN KEY (`meetId`) REFERENCES `meetings`(`meetId`) ON DELETE CASCADE ON UPDATE CASCADE;
