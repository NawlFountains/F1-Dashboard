export interface SessionSchedule {
	name: string,
	date: string,
}

export interface Schedule {
	"round_number": number,
	"event_name": string,
	"country": string,
	"location": string,
	"event_date": string,
	"sessions": SessionSchedule[]
}

export interface DriverRaceResult {
	driver_number: number,
	abbreviation: string,
	driver_id: string,
	team_name: string,
	team_color: string,
	driver_name: string,
	position: number,
	qualy_position: string,
	grid_position: number,
	status: string,
	points: string,
	laps: number,
	time: string,
}

export interface DriverQualifyingResult {
	driver_number: number,
	abbreviation: string,
	driver_id: string,
	team_name: string,
	team_color: string,
	driver_name: string,
	position: number,
	q1: string,
	q2: string,
	q3: string,
}

export interface DriverPracticeResult {
	driver_number: number,
	abbreviation: string,
	driver_id: string,
	team_name: string,
	team_color: string,
	driver_name: string,
}

export type SessionResultsData =
	| { kind: "race"; results: DriverRaceResult[] }
	| { kind: "qualifying"; results: DriverQualifyingResult[] }
	| { kind: "practice"; results: DriverPracticeResult[] }

export type RaceSessionType = "R" | "S"
export type QualifyingSessionType = "Q" | "SQ" | "SS"
export type PracticeSessionType = "FP1" | "FP2" | "FP3"

export type SessionType = RaceSessionType | QualifyingSessionType | PracticeSessionType

export type TeamSummaries = Record<string, string>
