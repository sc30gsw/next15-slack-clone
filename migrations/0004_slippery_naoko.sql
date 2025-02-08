DROP INDEX "userId";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "email";--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "hashedPassword" TO "hashedPassword" text;--> statement-breakpoint
CREATE INDEX `userId` ON `account` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `email` ON `user` (`email`);