import type {TeamSummaries} from "../types"
import { apiGet } from "./client"

export async function getUpgradesSummaries(year: number, round_number: number): Promise<TeamSummaries> {
	return apiGet(`/upgrades/${year}/${round_number}`)
}

export async function getUpgradesSummariesByTeam(year: number, round_number: number, team_name: string): Promise<string> {
	return apiGet(`/upgrades/${year}/${round_number}/${team_name}`)
}
