-- AlterTable
ALTER TABLE `members` ADD COLUMN `approvedOrDeclinedAt` DATETIME(3) NULL,
    ADD COLUMN `approvedOrDeclinedBy` INTEGER NULL,
    ADD COLUMN `declineReason` TEXT NULL;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_approvedOrDeclinedBy_fkey` FOREIGN KEY (`approvedOrDeclinedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
