import {useEffect, useState} from "react"
import { getDriverLaps } from '../api/laps'
import type {DriverLap, SessionType} from '../types'

export const useLaps = (year?: number, round_number?: number, session_type?: SessionType, driver_abbrevation?: string) => {
	const [ loading, setLoading] = useState(false)
	const [ laps, setLaps ] = useState<DriverLap[]>([])
	const [ loadError, setLoadError ] = useState('')

	useEffect(() => {
		if (!year || !round_number || !session_type || !driver_abbrevation) return
		async function loadLaps() {
			try {
				setLoadError('')
				setLoading(true)
				const data = await getDriverLaps(year, round_number, session_type, driver_abbrevation)
				setLaps(data)
			} catch (err) {
				setLoadError(err instanceof Error ? err.message : "Unkwon error")
				setLaps([])
			} finally {
				setLoading(false)
			}
		}
		loadLaps()
	}, [year, round_number, session_type, driver_abbrevation] )

	return {
		loading,
		loadError,
		laps
	}
}
