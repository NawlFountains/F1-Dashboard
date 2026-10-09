import type {Schedule} from '../types'
import {apiGet} from './client'

function cleanSchedule(schedule: Schedule): Schedule {
  return {
    ...schedule,
    sessions: schedule.sessions.filter(session => session.date !== null),
  }
}

export async function getSchedules(year: number): Promise<Schedule[]> {
	const data = await apiGet<Schedule[]>(`/schedule/${year}`)
	return data.map(cleanSchedule)
}

export async function getCurrentSchedule(): Promise<Schedule> {
	const data = await apiGet<Schedule>('/schedule/current')
	return cleanSchedule(data)
}
