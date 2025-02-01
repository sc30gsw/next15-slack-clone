import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

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
