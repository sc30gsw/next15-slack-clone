type FetchArgs = Parameters<typeof fetch>

export const fetcher = async <T>(url: FetchArgs[0], args: FetchArgs[1]) => {
	const res = await fetch(url, args)
	const json: T = await res.json()

	return json
}
