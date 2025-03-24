CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`workspaceId` text NOT NULL,
	`memberOneId` text,
	`memberTwoId` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`memberOneId`) REFERENCES `members`(`userId`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`memberTwoId`) REFERENCES `members`(`userId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `conversation_workspaceId` ON `conversations` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `conversation_memberOneId` ON `conversations` (`memberOneId`);--> statement-breakpoint
CREATE INDEX `conversation_memberTwoId` ON `conversations` (`memberTwoId`);--> statement-breakpoint
CREATE UNIQUE INDEX `workspaceId_memberIds` ON `conversations` (`workspaceId`,`memberOneId`,`memberTwoId`);--> statement-breakpoint
ALTER TABLE `messages` ADD `conversationId` text REFERENCES conversations(id);--> statement-breakpoint
CREATE INDEX `message_conversationId` ON `messages` (`conversationId`);