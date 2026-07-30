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
	time: number,
}

export interface DriverQualifyingResult {
	driver_number: number,
	abbreviation: string,
	driver_id: string,
	team_name: string,
	team_color: string,
	driver_name: string,
	position: number,
	q1: number,
	q2: number,
	q3: number,
}

export interface DriverPracticeResult {
	driver_number: number,
	abbreviation: string,
	driver_id: string,
	team_name: string,
	team_color: string,
	driver_name: string,
}

export type TyreCompound = "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET" | "UNKNOWN"

export interface DriverLap {
	time: number | null                 
	abbreviation: string | null
	driver_number: number | null
	lap_time: number | null              
	lap_number: number | null
	stint: number | null
	pit_out_time: number | null           
	pit_in_time: number | null         
	sector_1_time: number | null
	sector_2_time: number | null
	sector_3_time: number | null
	sector_1_session_time: string | null
	sector_2_session_time: string | null
	sector_3_session_time: string | null
	speed_i1: number | null
	speed_i2: number | null
	speed_fl: number | null
	speed_st: number | null
	is_personal_best: boolean
	compound: TyreCompound | null
	tyre_life: number | null
	fresh_tyre: boolean | null
	team_name: string | null
	lap_start_time: string | null
	lap_start_date: string | null         // ISO 8601 UTC
	track_status: string | null
	position: number | null
	deleted: boolean
	deleted_reason: string | null
	is_accurate: boolean
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
