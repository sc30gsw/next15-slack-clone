CREATE TABLE `reactions` (
	`id` text PRIMARY KEY NOT NULL,
	`workspaceId` text NOT NULL,
	`messageId` text,
	`userId` text NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`messageId`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `reaction_workspaceId` ON `reactions` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `reaction_messageId` ON `reactions` (`messageId`);--> statement-breakpoint
CREATE INDEX `reaction_userId` ON `reactions` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `workspaceId_messageId_userId` ON `reactions` (`workspaceId`,`messageId`,`userId`);--> statement-breakpoint
CREATE INDEX `message_channelId_parentMessageId_conversationId` ON `messages` (`channelId`,`parentMessageId`,`conversationId`);