/*
  Warnings:

  - You are about to alter the column `fromDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `toDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `route` on the `trip_record` table. All the data in the column will be lost.
  - Added the required column `tripDate` to the `trip_record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `member_billing_history` MODIFY `fromDate` DATETIME NOT NULL,
    MODIFY `toDate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `trip_record` DROP COLUMN `route`,
    ADD COLUMN `paymentStatus` ENUM('UNPAID', 'PARTIAL', 'PAID') NOT NULL DEFAULT 'UNPAID',
    ADD COLUMN `totalAmount` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `tripDate` DATETIME NOT NULL,
    MODIFY `amountPerTrip` DOUBLE NOT NULL DEFAULT 0.0,
    MODIFY `numberOfTrips` INTEGER NOT NULL DEFAULT 0;
