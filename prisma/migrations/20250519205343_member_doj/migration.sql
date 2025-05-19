/*
  Warnings:

  - You are about to alter the column `fromDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `toDate` on the `member_billing_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `member_billing_history` MODIFY `fromDate` DATETIME NOT NULL,
    MODIFY `toDate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `members` MODIFY `doj` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
