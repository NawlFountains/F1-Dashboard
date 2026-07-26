import type {DriverRaceResult } from "../types"

const API_URL = "http://localhost:8000/api/results"

export async function getRaceResults(year: number, round_number: number): Promise<DriverRaceResult[]> {
	const response = await fetch(`${API_URL}/${year}/${round_number}/race`, { method: "GET" })

	if (!response.ok) {
		const errorBody = await response.json()
		throw new Error(errorBody.detail || `Error ${response.status}`)
	}
	return response.json()
}
