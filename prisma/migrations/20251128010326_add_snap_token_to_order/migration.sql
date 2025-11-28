-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_userId_fkey`;

-- DropIndex
DROP INDEX `orders_userId_fkey` ON `orders`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `snapToken` VARCHAR(191) NULL,
    MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
