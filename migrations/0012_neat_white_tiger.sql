CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`image` text,
	`channelId` text NOT NULL,
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
CREATE INDEX `message_channelId` ON `messages` (`channelId`);--> statement-breakpoint
CREATE INDEX `message_userId` ON `messages` (`userId`);--> statement-breakpoint
CREATE INDEX `message_workspaceId` ON `messages` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `message_parentMessageId` ON `messages` (`parentMessageId`);