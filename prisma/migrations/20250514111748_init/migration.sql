-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(50) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'MALE',
    `email` VARCHAR(100) NULL,
    `phone` VARCHAR(15) NOT NULL,
    `role` ENUM('ADMIN', 'ADMIN_VIEWER', 'TSMWA_EDITOR', 'TSMWA_VIEWER', 'TQMA_EDITOR', 'TQMA_VIEWER') NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `membershipId` VARCHAR(191) NOT NULL,
    `approvalStatus` ENUM('PENDING', 'APPROVED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
    `membershipStatus` ENUM('ACTIVE', 'INACTIVE', 'CANCELLED') NOT NULL DEFAULT 'INACTIVE',
    `nextDueDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isPaymentDue` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'TRUE',
    `electricalUscNumber` VARCHAR(225) NOT NULL,
    `scNumber` VARCHAR(225) NOT NULL,
    `applicantName` VARCHAR(50) NOT NULL,
    `relation` ENUM('SO', 'DO', 'WO') NOT NULL DEFAULT 'SO',
    `relativeName` VARCHAR(50) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'MALE',
    `firmName` VARCHAR(50) NOT NULL,
    `proprietorName` VARCHAR(50) NOT NULL,
    `proprietorStatus` ENUM('OWNER', 'TENANT', 'TRADER') NOT NULL DEFAULT 'OWNER',
    `proprietorType` ENUM('OWNED', 'RENTED', 'TRADING', 'OTHER') NOT NULL DEFAULT 'OWNED',
    `sanctionedHP` DECIMAL(10, 2) NOT NULL,
    `phoneNumber1` VARCHAR(15) NOT NULL,
    `phoneNumber2` VARCHAR(15) NULL,
    `surveyNumber` INTEGER NOT NULL,
    `village` VARCHAR(50) NOT NULL,
    `zone` VARCHAR(50) NOT NULL,
    `mandal` VARCHAR(50) NOT NULL,
    `district` VARCHAR(50) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `pinCode` VARCHAR(10) NOT NULL,
    `estimatedMaleWorker` INTEGER NOT NULL DEFAULT 0,
    `estimatedFemaleWorker` INTEGER NOT NULL DEFAULT 0,
    `modifiedBy` INTEGER NULL,
    `approvedOrDeclinedBy` INTEGER NULL,
    `approvedOrDeclinedAt` DATETIME(3) NULL,
    `declineReason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `members_firmName_key`(`firmName`),
    UNIQUE INDEX `members_surveyNumber_key`(`surveyNumber`),
    PRIMARY KEY (`membershipId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partner_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(225) NOT NULL,
    `partnerName` VARCHAR(50) NOT NULL,
    `partnerAadharNo` VARCHAR(15) NOT NULL,
    `partnerPanNo` VARCHAR(12) NOT NULL,
    `contactNumber` VARCHAR(13) NOT NULL,
    `emailId` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `machinery_information` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(225) NULL,
    `branchId` INTEGER NULL,
    `machineName` VARCHAR(50) NOT NULL,
    `machineCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(225) NOT NULL,
    `electricalUscNumber` VARCHAR(225) NOT NULL,
    `scNumber` VARCHAR(225) NOT NULL,
    `proprietorType` VARCHAR(50) NOT NULL,
    `proprietorStatus` VARCHAR(50) NOT NULL,
    `placeOfBusiness` VARCHAR(50) NOT NULL,
    `sanctionedHP` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `branches_electricalUscNumber_key`(`electricalUscNumber`),
    UNIQUE INDEX `branches_scNumber_key`(`scNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compliance_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(191) NOT NULL,
    `gstInNumber` VARCHAR(50) NOT NULL,
    `gstInCertificatePath` VARCHAR(225) NOT NULL,
    `factoryLicenseNumber` VARCHAR(50) NOT NULL,
    `factoryLicensePath` VARCHAR(225) NOT NULL,
    `tspcbOrderNumber` VARCHAR(50) NOT NULL,
    `tspcbCertificatePath` VARCHAR(225) NOT NULL,
    `mdlNumber` VARCHAR(50) NOT NULL,
    `mdlCertificatePath` VARCHAR(225) NOT NULL,
    `udyamCertificateNumber` VARCHAR(50) NOT NULL,
    `udyamCertificatePath` VARCHAR(225) NOT NULL,
    `fullAddress` VARCHAR(225) NOT NULL,
    `partnerName` VARCHAR(50) NOT NULL,
    `contactNumber` VARCHAR(13) NOT NULL,
    `AadharNumber` VARCHAR(15) NOT NULL,
    `emailId` VARCHAR(50) NOT NULL,
    `panNumber` VARCHAR(12) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `compliance_details_membershipId_key`(`membershipId`),
    UNIQUE INDEX `compliance_details_gstInNumber_key`(`gstInNumber`),
    UNIQUE INDEX `compliance_details_factoryLicenseNumber_key`(`factoryLicenseNumber`),
    UNIQUE INDEX `compliance_details_tspcbOrderNumber_key`(`tspcbOrderNumber`),
    UNIQUE INDEX `compliance_details_mdlNumber_key`(`mdlNumber`),
    UNIQUE INDEX `compliance_details_udyamCertificateNumber_key`(`udyamCertificateNumber`),
    UNIQUE INDEX `compliance_details_fullAddress_key`(`fullAddress`),
    UNIQUE INDEX `compliance_details_panNumber_key`(`panNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `similar_membership_inquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(191) NOT NULL,
    `is_member_of_similar_org` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'FALSE',
    `has_applied_earlier` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'FALSE',
    `is_valid_member` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'FALSE',
    `is_executive_member` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'FALSE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `similar_membership_inquiry_membershipId_key`(`membershipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(225) NOT NULL,
    `documentName` VARCHAR(50) NOT NULL,
    `documentPath` VARCHAR(225) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proposers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(225) NOT NULL,
    `proposerID` VARCHAR(225) NULL,
    `signaturePath` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `proposers_membershipId_key`(`membershipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `executive_proposers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(191) NOT NULL,
    `proposerID` VARCHAR(225) NULL,
    `signaturePath` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `executive_proposers_membershipId_key`(`membershipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `declarations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(191) NOT NULL,
    `agreesToTerms` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'FALSE',
    `membershipFormPath` VARCHAR(225) NOT NULL,
    `applicationSignaturePath` VARCHAR(225) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `declarations_membershipId_key`(`membershipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members_pending_changes` (
    `id` VARCHAR(191) NOT NULL,
    `membershipId` VARCHAR(191) NOT NULL,
    `approvalStatus` ENUM('PENDING', 'APPROVED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
    `approvedOrDeclinedBy` INTEGER NULL,
    `updatedData` JSON NOT NULL,
    `modifiedBy` INTEGER NOT NULL,
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `declineReason` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `labours` (
    `labourId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(100) NOT NULL,
    `fatherName` VARCHAR(100) NOT NULL,
    `permanentAddress` VARCHAR(225) NOT NULL,
    `presentAddress` VARCHAR(225) NOT NULL,
    `aadharNumber` VARCHAR(12) NOT NULL,
    `panNumber` VARCHAR(12) NOT NULL,
    `esiNumber` VARCHAR(50) NULL,
    `employedIn` VARCHAR(100) NOT NULL,
    `employedFrom` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignedTo` VARCHAR(225) NULL,
    `onBench` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'TRUE',
    `signaturePath` VARCHAR(225) NOT NULL,
    `fingerPrint` VARCHAR(225) NOT NULL,
    `aadharPhotoPath` VARCHAR(225) NOT NULL,
    `livePhotoPath` VARCHAR(225) NOT NULL,
    `isActive` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'TRUE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,
    `modifiedBy` INTEGER NULL,

    UNIQUE INDEX `labours_aadharNumber_key`(`aadharNumber`),
    UNIQUE INDEX `labours_panNumber_key`(`panNumber`),
    PRIMARY KEY (`labourId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `labours_additional_docs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `labourId` VARCHAR(225) NOT NULL,
    `docName` VARCHAR(50) NOT NULL,
    `docFilePath` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `labours_pending_changes` (
    `id` VARCHAR(191) NOT NULL,
    `labourId` VARCHAR(191) NOT NULL,
    `approvalStatus` ENUM('PENDING', 'APPROVED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
    `approvedOrDeclinedBy` INTEGER NULL,
    `updatedData` JSON NOT NULL,
    `modifiedBy` INTEGER NOT NULL,
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `labour_history` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `labourId` VARCHAR(225) NOT NULL,
    `assignedTo` VARCHAR(225) NULL,
    `onBench` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'TRUE',
    `reasonForTransfer` VARCHAR(225) NULL,
    `fromDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `toDate` DATETIME(3) NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicles` (
    `vehicleId` VARCHAR(191) NOT NULL,
    `isActive` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'TRUE',
    `ownerName` VARCHAR(50) NOT NULL,
    `phoneNumber` VARCHAR(13) NOT NULL,
    `emailId` VARCHAR(50) NOT NULL,
    `vehicleNumber` VARCHAR(20) NOT NULL,
    `createdBy` INTEGER NULL,
    `modifiedBy` INTEGER NULL,
    `vehicleType` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `vehicles_vehicleNumber_key`(`vehicleNumber`),
    PRIMARY KEY (`vehicleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip_record` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleId` VARCHAR(225) NOT NULL,
    `route` VARCHAR(191) NOT NULL,
    `amountPerTrip` DOUBLE NOT NULL,
    `numberOfTrips` INTEGER NOT NULL,
    `balanceAmount` DOUBLE NOT NULL DEFAULT 0.0,
    `amountPaid` DOUBLE NOT NULL DEFAULT 0.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meetings` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `agenda` TEXT NULL,
    `notes` TEXT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `location` VARCHAR(255) NULL,
    `status` ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `createdBy` INTEGER NOT NULL,
    `attendees` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `modifiedBy` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_attendees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `meetingId` VARCHAR(225) NOT NULL,
    `memberId` VARCHAR(225) NULL,
    `vehicleId` VARCHAR(225) NULL,
    `labourId` VARCHAR(225) NULL,
    `isCustom` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'FALSE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `meeting_attendees_meetingId_memberId_vehicleId_key`(`meetingId`, `memberId`, `vehicleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_approvedOrDeclinedBy_fkey` FOREIGN KEY (`approvedOrDeclinedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `partner_details` ADD CONSTRAINT `partner_details_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `machinery_information` ADD CONSTRAINT `machinery_information_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `machinery_information` ADD CONSTRAINT `machinery_information_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branches` ADD CONSTRAINT `branches_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `compliance_details` ADD CONSTRAINT `compliance_details_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `similar_membership_inquiry` ADD CONSTRAINT `similar_membership_inquiry_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attachments` ADD CONSTRAINT `attachments_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposers` ADD CONSTRAINT `proposers_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposers` ADD CONSTRAINT `proposers_proposerID_fkey` FOREIGN KEY (`proposerID`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `executive_proposers` ADD CONSTRAINT `executive_proposers_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `executive_proposers` ADD CONSTRAINT `executive_proposers_proposerID_fkey` FOREIGN KEY (`proposerID`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `declarations` ADD CONSTRAINT `declarations_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members_pending_changes` ADD CONSTRAINT `members_pending_changes_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members_pending_changes` ADD CONSTRAINT `members_pending_changes_approvedOrDeclinedBy_fkey` FOREIGN KEY (`approvedOrDeclinedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members_pending_changes` ADD CONSTRAINT `members_pending_changes_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `labours` ADD CONSTRAINT `labours_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `labours` ADD CONSTRAINT `labours_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `labours_additional_docs` ADD CONSTRAINT `labours_additional_docs_labourId_fkey` FOREIGN KEY (`labourId`) REFERENCES `labours`(`labourId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `labours_pending_changes` ADD CONSTRAINT `labours_pending_changes_labourId_fkey` FOREIGN KEY (`labourId`) REFERENCES `labours`(`labourId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `labours_pending_changes` ADD CONSTRAINT `labours_pending_changes_approvedOrDeclinedBy_fkey` FOREIGN KEY (`approvedOrDeclinedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `labours_pending_changes` ADD CONSTRAINT `labours_pending_changes_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `labour_history` ADD CONSTRAINT `labour_history_labourId_fkey` FOREIGN KEY (`labourId`) REFERENCES `labours`(`labourId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `labour_history` ADD CONSTRAINT `labour_history_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_record` ADD CONSTRAINT `trip_record_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`vehicleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_attendees` ADD CONSTRAINT `meeting_attendees_meetingId_fkey` FOREIGN KEY (`meetingId`) REFERENCES `meetings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_attendees` ADD CONSTRAINT `meeting_attendees_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_attendees` ADD CONSTRAINT `meeting_attendees_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`vehicleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_attendees` ADD CONSTRAINT `meeting_attendees_labourId_fkey` FOREIGN KEY (`labourId`) REFERENCES `labours`(`labourId`) ON DELETE CASCADE ON UPDATE CASCADE;
