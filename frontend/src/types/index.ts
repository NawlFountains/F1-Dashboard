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

export type TeamSummaries = Record<string, string>
