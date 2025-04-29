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
    `isExecutive` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'FALSE',
    `electricalUscNumber` VARCHAR(225) NOT NULL,
    `applicantName` VARCHAR(50) NOT NULL,
    `guardianRelation` ENUM('SO', 'DO', 'WO') NOT NULL DEFAULT 'SO',
    `guardianName` VARCHAR(50) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'MALE',
    `firmName` VARCHAR(50) NOT NULL,
    `proprietorName` VARCHAR(50) NOT NULL,
    `officeNumber` VARCHAR(15) NOT NULL,
    `phoneNumber1` VARCHAR(15) NOT NULL,
    `phoneNumber2` VARCHAR(15) NULL,
    `surveyNumber` INTEGER NOT NULL,
    `village` VARCHAR(50) NOT NULL,
    `zone` VARCHAR(50) NOT NULL,
    `ownershipType` ENUM('OWNER', 'TENANT', 'TRADER') NOT NULL DEFAULT 'OWNER',
    `businessType` ENUM('OWN_BUSINESS', 'FACTORY_ON_LEASE') NOT NULL DEFAULT 'OWN_BUSINESS',
    `sanctionedHP` DECIMAL(10, 2) NOT NULL,
    `estimatedMaleWorker` INTEGER NOT NULL DEFAULT 0,
    `estimatedFemaleWorker` INTEGER NOT NULL DEFAULT 0,
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
CREATE TABLE `machinery_information` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(191) NULL,
    `branchId` INTEGER NULL,
    `highPolishMachine` INTEGER NOT NULL DEFAULT 0,
    `sliceMachine` INTEGER NOT NULL DEFAULT 0,
    `cuttingMachine` INTEGER NOT NULL DEFAULT 0,
    `other` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `machinery_information_membershipId_key`(`membershipId`),
    UNIQUE INDEX `machinery_information_branchId_key`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(225) NOT NULL,
    `electricalUscNumber` VARCHAR(225) NOT NULL,
    `surveyNumber` INTEGER NOT NULL,
    `village` VARCHAR(50) NOT NULL,
    `zone` VARCHAR(50) NOT NULL,
    `ownershipType` ENUM('OWNER', 'TENANT', 'TRADER') NOT NULL DEFAULT 'OWNER',
    `businessType` ENUM('OWN_BUSINESS', 'FACTORY_ON_LEASE') NOT NULL DEFAULT 'OWN_BUSINESS',
    `sanctionedHP` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `branches_electricalUscNumber_key`(`electricalUscNumber`),
    UNIQUE INDEX `branches_surveyNumber_key`(`surveyNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compliance_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(191) NOT NULL,
    `gstinNumber` VARCHAR(50) NOT NULL,
    `factoryLicenseNumber` VARCHAR(50) NOT NULL,
    `tspcbOrderNumber` VARCHAR(50) NOT NULL,
    `mdlNumber` VARCHAR(50) NOT NULL,
    `udyamCertificateNumber` VARCHAR(50) NOT NULL,
    `fullAddress` VARCHAR(225) NOT NULL,
    `partnerName` VARCHAR(50) NOT NULL,
    `contactNumber` VARCHAR(13) NOT NULL,
    `AadharNumber` VARCHAR(15) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `compliance_details_membershipId_key`(`membershipId`),
    UNIQUE INDEX `compliance_details_gstinNumber_key`(`gstinNumber`),
    UNIQUE INDEX `compliance_details_factoryLicenseNumber_key`(`factoryLicenseNumber`),
    UNIQUE INDEX `compliance_details_tspcbOrderNumber_key`(`tspcbOrderNumber`),
    UNIQUE INDEX `compliance_details_mdlNumber_key`(`mdlNumber`),
    UNIQUE INDEX `compliance_details_udyamCertificateNumber_key`(`udyamCertificateNumber`),
    UNIQUE INDEX `compliance_details_fullAddress_key`(`fullAddress`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `similar_membership_inquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(191) NOT NULL,
    `isSimilarMember` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'FALSE',
    `previousMembershipDetails` VARCHAR(225) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `similar_membership_inquiry_membershipId_key`(`membershipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(191) NOT NULL,
    `attachmentType` ENUM('SALE_DEED', 'ELECTRICITY_BILL', 'RENTAL_DEED', 'PARTNERSHIP_DEED', 'PHOTOS', 'DOCUMENTS') NOT NULL DEFAULT 'SALE_DEED',
    `filePath` VARCHAR(225) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `attachments_membershipId_key`(`membershipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proposers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(225) NOT NULL,
    `proposerType` ENUM('FACTORY_OWNER', 'EXECUTIVE_MEMBER') NULL,
    `proposerID` VARCHAR(225) NULL,
    `signaturePath` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `executive_proposers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(191) NOT NULL,
    `proposerType` ENUM('FACTORY_OWNER', 'EXECUTIVE_MEMBER') NULL,
    `proposerID` VARCHAR(225) NULL,
    `signaturePath` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `declarations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membershipId` VARCHAR(191) NOT NULL,
    `agreesToTerms` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'FALSE',
    `partnerPhotoPath` VARCHAR(225) NOT NULL,
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
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

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
ALTER TABLE `members` ADD CONSTRAINT `members_approvedOrDeclinedBy_fkey` FOREIGN KEY (`approvedOrDeclinedBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `labours` ADD CONSTRAINT `labours_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `labours_additional_docs` ADD CONSTRAINT `labours_additional_docs_labourId_fkey` FOREIGN KEY (`labourId`) REFERENCES `labours`(`labourId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `labour_history` ADD CONSTRAINT `labour_history_labourId_fkey` FOREIGN KEY (`labourId`) REFERENCES `labours`(`labourId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `labour_history` ADD CONSTRAINT `labour_history_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `members`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_record` ADD CONSTRAINT `trip_record_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`vehicleId`) ON DELETE CASCADE ON UPDATE CASCADE;

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
