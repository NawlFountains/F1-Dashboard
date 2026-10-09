import type {DriverPracticeResult, DriverQualifyingResult, DriverRaceResult, PracticeSessionType, QualifyingSessionType, RaceSessionType } from "../types"
import { apiGet } from "./client"

export async function getSprintOrRaceResults(year: number, round_number: number, session_type: RaceSessionType): Promise<DriverRaceResult[]> {
	return apiGet(`/results/${year}/${round_number}/${session_type}`)
}

export async function getQualifyingResults(year: number, round_number: number, session_type: QualifyingSessionType): Promise<DriverQualifyingResult[]> {
	return apiGet(`/results/${year}/${round_number}/${session_type}`)
}

export async function getPracticeResults(year: number, round_number: number, session_type: PracticeSessionType ): Promise<DriverPracticeResult[]> {
	return apiGet(`/results/${year}/${round_number}/${session_type}`)
}
