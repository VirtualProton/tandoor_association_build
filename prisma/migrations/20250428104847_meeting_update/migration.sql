-- AlterTable
ALTER TABLE `meetings` ADD COLUMN `modifiedBy` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
