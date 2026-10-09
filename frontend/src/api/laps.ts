import type { SessionType, DriverLap } from '../types'
import { apiGet } from './client'

export async function getDriverLaps(year: number, round_number: number, session_type: SessionType, driver_abbrevation: string): Promise<DriverLap []> {
	return apiGet(`/laps/${year}/${round_number}/${session_type}/${driver_abbrevation}`)
}
