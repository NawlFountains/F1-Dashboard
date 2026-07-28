import {useEffect, useState} from "react"
import type {Schedule} from '../types'
import {getCurrentSchedule, getSchedules} from "../api/schedules"

export const useSchedules = (year?: number) => {
	const [ loading, setLoading] = useState(false)
	const [ schedules, setSchedules ] = useState<Schedule[]>([])
	const [ currentSchedule, setCurrentSchedule ] = useState<Schedule>()
	const [ loadError, setLoadError ] = useState('')

	useEffect(() => {
		async function loadSchedules() {
			try {
				setLoading(true)
				const [schedulesData, currentScheduleData ] = await Promise.all([
					getSchedules(year),
					getCurrentSchedule()
				])
				setSchedules(schedulesData)
				setCurrentSchedule(currentScheduleData)
			} catch (err) {
				setLoadError(err instanceof Error ? err.message : "Unkwon error")
			} finally {
				setLoading(false)
			}
		}
		loadSchedules()
	}, [year] )

	return {
		loading,
		loadError,
		schedules,
		currentSchedule
	}
}
