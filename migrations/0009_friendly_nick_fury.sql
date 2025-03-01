PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_members` (
	`userId` text,
	`workspaceId` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	PRIMARY KEY(`userId`, `workspaceId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_members`("userId", "workspaceId", "role", "created_at", "updated_at") SELECT "userId", "workspaceId", "role", "created_at", "updated_at" FROM `members`;--> statement-breakpoint
DROP TABLE `members`;--> statement-breakpoint
ALTER TABLE `__new_members` RENAME TO `members`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `member_userId` ON `members` (`userId`);--> statement-breakpoint
CREATE INDEX `member_workspaceId` ON `members` (`workspaceId`);--> statement-breakpoint
CREATE UNIQUE INDEX `workspaceId_userId` ON `members` (`workspaceId`,`userId`);