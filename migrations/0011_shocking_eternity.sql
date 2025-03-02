CREATE INDEX `channel_workspaceId` ON `channels` (`workspaceId`);--> statement-breakpoint
CREATE UNIQUE INDEX `workspaceId_name` ON `channels` (`workspaceId`,`name`);