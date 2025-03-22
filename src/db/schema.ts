import { relations, sql } from 'drizzle-orm'
import {
  type AnySQLiteColumn,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import type { AdapterAccountType } from 'next-auth/adapters'

export const users = sqliteTable(
  'user',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').unique(),
    email: text('email').unique(),
    emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
    hashedPassword: text('hashedPassword'),
    image: text('image'),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    updateAt: integer('updated_at', { mode: 'timestamp_ms' }).$onUpdate(
      () => new Date(),
    ),
  },
  (user) => [
    uniqueIndex('email').on(user.email),
    uniqueIndex('name').on(user.name),
  ],
)

export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaces),
  members: many(members),
  messages: many(messages),
}))

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
    uniqueIndex('account_userId').on(account.userId),
  ],
)

export type InsertAccount = typeof accounts.$inferInsert

export const sessions = sqliteTable(
  'session',
  {
    sessionToken: text('sessionToken').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (session) => [index('session_userId').on(session.userId)],
)

export type InsertSession = typeof sessions.$inferInsert

export const workspaces = sqliteTable(
  'workspaces',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    joinCode: text('join_code').notNull(),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    updateAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
      () => new Date(),
    ),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (workspace) => [index('workspace_userId').on(workspace.userId)],
)

export type InsertPost = typeof workspaces.$inferInsert
export type SelectPost = typeof workspaces.$inferSelect

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  user: one(users, {
    fields: [workspaces.userId],
    references: [users.id],
  }),
  members: many(members),
  channels: many(channels),
  messages: many(messages),
}))

export const members = sqliteTable(
  'members',
  {
    userId: text('userId').references(() => users.id, { onDelete: 'cascade' }),
    workspaceId: text('workspaceId')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    role: text('role', { enum: ['admin', 'member'] }).notNull(),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    updateAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
      () => new Date(),
    ),
  },
  (members) => [
    primaryKey({ columns: [members.userId, members.workspaceId] }),
    index('member_userId').on(members.userId),
    index('member_workspaceId').on(members.workspaceId),
    uniqueIndex('workspaceId_userId').on(members.workspaceId, members.userId),
  ],
)

export type InsertMember = typeof members.$inferInsert
export type SelectMember = typeof members.$inferSelect

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [members.workspaceId],
    references: [workspaces.id],
  }),
}))

export const channels = sqliteTable(
  'channels',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    workspaceId: text('workspaceId')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    updateAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
      () => new Date(),
    ),
  },
  (channels) => [
    index('channel_workspaceId').on(channels.workspaceId),
    uniqueIndex('workspaceId_name').on(channels.workspaceId, channels.name),
  ],
)

export type InsertChannel = typeof channels.$inferInsert
export type SelectChannel = typeof channels.$inferSelect

export const channelsRelations = relations(channels, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [channels.workspaceId],
    references: [workspaces.id],
  }),
  messages: many(messages),
}))

export const messages = sqliteTable(
  'messages',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    body: text('body').notNull(),
    image: text('image'),
    channelId: text('channelId').references(() => channels.id, {
      onDelete: 'cascade',
    }),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    workspaceId: text('workspaceId')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    parentMessageId: text('parentMessageId').references(
      (): AnySQLiteColumn => messages.id,
      {
        onDelete: 'cascade',
      },
    ),
    // TODO: add conversationId
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    updateAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
      () => new Date(),
    ),
  },
  (message) => [
    index('message_channelId').on(message.channelId),
    index('message_userId').on(message.userId),
    index('message_workspaceId').on(message.workspaceId),
    index('message_parentMessageId').on(message.parentMessageId),
  ],
)

export type InsertMessage = typeof messages.$inferInsert
export type SelectMessage = typeof messages.$inferSelect

export const messagesRelations = relations(messages, ({ one, many }) => ({
  channel: one(channels, {
    fields: [messages.channelId],
    references: [channels.id],
  }),
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [messages.workspaceId],
    references: [workspaces.id],
  }),
  parentMessage: one(messages, {
    fields: [messages.parentMessageId],
    references: [messages.id],
  }),
  threads: many(messages, {
    relationName: 'thread',
  }),
}))
