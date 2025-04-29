-- AlterTable
ALTER TABLE `labours` ADD COLUMN `modifiedBy` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `labours` ADD CONSTRAINT `labours_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
