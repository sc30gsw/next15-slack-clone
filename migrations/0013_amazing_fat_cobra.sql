PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`image` text,
	`channelId` text,
	`userId` text NOT NULL,
	`workspaceId` text NOT NULL,
	`parentMessageId` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`channelId`) REFERENCES `channels`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parentMessageId`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_messages`("id", "body", "image", "channelId", "userId", "workspaceId", "parentMessageId", "created_at", "updated_at") SELECT "id", "body", "image", "channelId", "userId", "workspaceId", "parentMessageId", "created_at", "updated_at" FROM `messages`;--> statement-breakpoint
DROP TABLE `messages`;--> statement-breakpoint
ALTER TABLE `__new_messages` RENAME TO `messages`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `message_channelId` ON `messages` (`channelId`);--> statement-breakpoint
CREATE INDEX `message_userId` ON `messages` (`userId`);--> statement-breakpoint
CREATE INDEX `message_workspaceId` ON `messages` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `message_parentMessageId` ON `messages` (`parentMessageId`);