PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`workspaceId` text NOT NULL,
	`memberOneId` text NOT NULL,
	`memberTwoId` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`memberOneId`,`workspaceId`) REFERENCES `members`(`userId`,`workspaceId`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`memberTwoId`,`workspaceId`) REFERENCES `members`(`userId`,`workspaceId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_conversations`("id", "workspaceId", "memberOneId", "memberTwoId", "created_at", "updated_at") SELECT "id", "workspaceId", "memberOneId", "memberTwoId", "created_at", "updated_at" FROM `conversations`;--> statement-breakpoint
DROP TABLE `conversations`;--> statement-breakpoint
ALTER TABLE `__new_conversations` RENAME TO `conversations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `conversation_workspaceId` ON `conversations` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `conversation_memberOneId` ON `conversations` (`memberOneId`);--> statement-breakpoint
CREATE INDEX `conversation_memberTwoId` ON `conversations` (`memberTwoId`);--> statement-breakpoint
CREATE UNIQUE INDEX `workspaceId_memberIds` ON `conversations` (`workspaceId`,`memberOneId`,`memberTwoId`);