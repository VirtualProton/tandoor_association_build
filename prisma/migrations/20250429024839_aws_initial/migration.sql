-- AlterTable
ALTER TABLE `vehicles` ADD COLUMN `createdBy` INTEGER NULL,
    ADD COLUMN `modifiedBy` INTEGER NULL,
    ADD COLUMN `vehicleType` VARCHAR(50) NULL;

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
