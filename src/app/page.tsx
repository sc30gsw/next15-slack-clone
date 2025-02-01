import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferResponseType } from 'hono'

const getTasks = async () => {
	const url = client.api.tasks.$url()
	type ResType = InferResponseType<typeof client.api.tasks.$get>

	const res = await fetcher<ResType>(url, {
		cache: 'force-cache',
	})

	return res
}

const Home = async () => {
	const tasks = await getTasks()

	return tasks.map((task) => (
		<div key={task.id}>
			<p>{task.title}</p>
			<p>{task.isCompleted.toString()}</p>
		</div>
	))
}

export default Home
