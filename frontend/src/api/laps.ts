import type { SessionType, DriverLap } from '../types'

const API_URL = "http://localhost:8000/api/laps"

export async function getDriverLaps(year: number, round_number: number, session_type: SessionType, driver_abbrevation: string): Promise<DriverLap []> {
	const response = await fetch(`${API_URL}/${year}/${round_number}/${session_type}/${driver_abbrevation}`, { method: "GET" })

	if (!response.ok) {
		const errorBody = await response.json()
		throw new Error(errorBody.detail || `Error ${response.status}`)
	}
	return response.json()
}
