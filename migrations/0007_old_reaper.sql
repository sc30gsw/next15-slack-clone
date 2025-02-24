CREATE TABLE `members` (
	`userId` text PRIMARY KEY NOT NULL,
	`workspaceId` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `member_workspaceId` ON `members` (`workspaceId`);--> statement-breakpoint
CREATE UNIQUE INDEX `workspaceId_userId` ON `members` (`workspaceId`,`userId`);--> statement-breakpoint
DROP INDEX `userId`;--> statement-breakpoint
CREATE UNIQUE INDEX `account_userId` ON `account` (`userId`);--> statement-breakpoint
CREATE INDEX `session_userId` ON `session` (`userId`);--> statement-breakpoint
CREATE INDEX `workspace_userId` ON `workspaces` (`userId`);