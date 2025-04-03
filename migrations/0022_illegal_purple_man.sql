PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reactions` (
	`id` text PRIMARY KEY NOT NULL,
	`workspaceId` text NOT NULL,
	`messageId` text,
	`userId` text NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`messageId`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`,`workspaceId`) REFERENCES `members`(`userId`,`workspaceId`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_reactions`("id", "workspaceId", "messageId", "userId", "value") SELECT "id", "workspaceId", "messageId", "userId", "value" FROM `reactions`;--> statement-breakpoint
DROP TABLE `reactions`;--> statement-breakpoint
ALTER TABLE `__new_reactions` RENAME TO `reactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `reaction_workspaceId` ON `reactions` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `reaction_messageId` ON `reactions` (`messageId`);--> statement-breakpoint
CREATE INDEX `reaction_userId` ON `reactions` (`userId`);