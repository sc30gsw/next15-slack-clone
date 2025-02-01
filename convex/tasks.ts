import { query } from './_generated/server'

type Task = {
	_id: string
	isCompleted: boolean
	text: string
	_creationTime: Date
}

export const get = query({
	args: {},
	handler: async (ctx): Promise<Task[]> => {
		return await ctx.db.query('tasks').collect()
	},
})
