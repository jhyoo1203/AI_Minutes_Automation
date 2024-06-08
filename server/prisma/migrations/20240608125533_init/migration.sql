-- CreateTable
CREATE TABLE `Minutes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `timeStart` DATETIME(3) NOT NULL,
    `timeEnd` DATETIME(3) NOT NULL,
    `place` VARCHAR(191) NOT NULL,
    `item` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `decision` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MinutesAttendees` (
    `minutes_id` INTEGER NOT NULL,
    `attendee_id` INTEGER NOT NULL,

    PRIMARY KEY (`minutes_id`, `attendee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MinutesAttendees` ADD CONSTRAINT `MinutesAttendees_minutes_id_fkey` FOREIGN KEY (`minutes_id`) REFERENCES `Minutes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MinutesAttendees` ADD CONSTRAINT `MinutesAttendees_attendee_id_fkey` FOREIGN KEY (`attendee_id`) REFERENCES `Attendees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
