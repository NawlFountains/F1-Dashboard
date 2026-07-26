import type {TeamSummaries} from "../types"

const API_URL = "http://localhost:8000/api/upgrades"

export async function getUpgradesSummaries(year: number, round_number: number): Promise<TeamSummaries> {
	const response = await fetch(`${API_URL}/${year}/${round_number}`, { method: "GET" })

	if (!response.ok) {
		const errorBody = await response.json()
		throw new Error(errorBody.detail || `Error ${response.status}`)
	}
	return response.json()
}

export async function getUpgradesSummariesByTeam(year: number, round_number: number, team_name: string): Promise<string> {
	const response = await fetch(`${API_URL}/${year}/${round_number}/${team_name}`, { method: "GET" })

	if (!response.ok) {
		const errorBody = await response.json()
		throw new Error(errorBody.detail || `Error ${response.status}`)
	}
	return response.json()
}
