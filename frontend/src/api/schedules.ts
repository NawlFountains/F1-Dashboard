import type {Schedule} from '../types'

const API_URL = "http://localhost:8000/api/schedule"

export async function getSchedules(year: number): Promise<Schedule[]> {
	const response = await fetch(`${API_URL}/${year}`, { method: "GET" })

	if (!response.ok) {
		const errorBody = await response.json()
		throw new Error(errorBody.detail || `Error ${response.status}`)
	}
	return response.json()
}

export async function getCurrentSchedule(): Promise<Schedule> {
	const response = await fetch(`${API_URL}/current`, { method: "GET" })

	if (!response.ok) {
		const errorBody = await response.json()
		throw new Error(errorBody.detail || `Error ${response.status}`)
	}
	return response.json()
}
