import { sql } from 'drizzle-orm'
import {
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import type { AdapterAccountType } from 'next-auth/adapters'

export const tasksTable = sqliteTable('tasks', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	isCompleted: integer('is_completed', { mode: 'boolean' })
		.notNull()
		.$default(() => false),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updateAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
		() => new Date(),
	),
})

export type InsertPost = typeof tasksTable.$inferInsert
export type SelectPost = typeof tasksTable.$inferSelect

export const users = sqliteTable(
	'user',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text('name'),
		email: text('email').unique(),
		emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
		hashedPassword: text('hashedPassword'),
		image: text('image'),
		createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
		updateAt: integer('updated_at', { mode: 'timestamp_ms' }).$onUpdate(
			() => new Date(),
		),
	},
	(user) => [uniqueIndex('email').on(user.email)],
)

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
		index('userId').on(account.userId),
	],
)

export type InsertAccount = typeof accounts.$inferInsert

export const sessions = sqliteTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
})

export type InsertSession = typeof sessions.$inferInsert
