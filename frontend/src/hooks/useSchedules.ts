import {useEffect, useState} from "react"
import type {Schedule} from '../types'
import {getCurrentSchedule, getSchedules} from "../api/schedules"

export const useSchedules = () => {
	const [ loading, setLoading] = useState(false)
	const [ schedules, setSchedules ] = useState<Schedule[]>([])
	const [ currentSchedule, setCurrentSchedule ] = useState<Schedule>()
	const [ loadError, setLoadError ] = useState('')
	const currentYear = new Date().getFullYear()

	useEffect(() => {
		async function loadSchedules() {
			try {
				setLoading(true)
				const [schedulesData, currentScheduleData ] = await Promise.all([
					getSchedules(currentYear),
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
	}, [] )

	return {
		loading,
		loadError,
		schedules,
		currentSchedule
	}
}
