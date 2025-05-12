/*
  Warnings:

  - A unique constraint covering the columns `[membershipId]` on the table `executive_proposers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[membershipId]` on the table `proposers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `executive_proposers_membershipId_key` ON `executive_proposers`(`membershipId`);

-- CreateIndex
CREATE UNIQUE INDEX `proposers_membershipId_key` ON `proposers`(`membershipId`);
