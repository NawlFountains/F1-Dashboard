import type {DriverPracticeResult, DriverQualifyingResult, DriverRaceResult, PracticeSessionType, QualifyingSessionType, RaceSessionType } from "../types"

const API_URL = "http://localhost:8000/api/results"

export async function getSprintOrRaceResults(year: number, round_number: number, session_type: RaceSessionType): Promise<DriverRaceResult[]> {
	const response = await fetch(`${API_URL}/${year}/${round_number}/${session_type}`, { method: "GET" })

	if (!response.ok) {
		const errorBody = await response.json()
		throw new Error(errorBody.detail || `Error ${response.status}`)
	}
	return response.json()
}

export async function getQualifyingResults(year: number, round_number: number, session_type: QualifyingSessionType): Promise<DriverQualifyingResult[]> {
	const response = await fetch(`${API_URL}/${year}/${round_number}/${session_type}`, { method: "GET" })

	if (!response.ok) {
		const errorBody = await response.json()
		throw new Error(errorBody.detail || `Error ${response.status}`)
	}
	return response.json()
}

export async function getPracticeResults(year: number, round_number: number, session_type: PracticeSessionType ): Promise<DriverPracticeResult[]> {
	const response = await fetch(`${API_URL}/${year}/${round_number}/${session_type}`, { method: "GET" })

	if (!response.ok) {
		const errorBody = await response.json()
		throw new Error(errorBody.detail || `Error ${response.status}`)
	}
	return response.json()
}

