/*
  Warnings:

  - You are about to drop the column `approvedOrDeclinedAt` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `approvedOrDeclinedBy` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `declineReason` on the `members` table. All the data in the column will be lost.
  - You are about to drop the `members_pending_changes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `members` DROP FOREIGN KEY `members_approvedOrDeclinedBy_fkey`;

-- DropForeignKey
ALTER TABLE `members_pending_changes` DROP FOREIGN KEY `members_pending_changes_approvedOrDeclinedBy_fkey`;

-- DropForeignKey
ALTER TABLE `members_pending_changes` DROP FOREIGN KEY `members_pending_changes_membershipId_fkey`;

-- DropForeignKey
ALTER TABLE `members_pending_changes` DROP FOREIGN KEY `members_pending_changes_modifiedBy_fkey`;

-- DropIndex
DROP INDEX `members_approvedOrDeclinedBy_fkey` ON `members`;

-- AlterTable
ALTER TABLE `members` DROP COLUMN `approvedOrDeclinedAt`,
    DROP COLUMN `approvedOrDeclinedBy`,
    DROP COLUMN `declineReason`,
    ADD COLUMN `modifiedBy` INTEGER NULL;

-- DropTable
DROP TABLE `members_pending_changes`;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
