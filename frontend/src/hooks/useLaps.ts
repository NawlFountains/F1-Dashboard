import {useEffect, useState} from "react"
import { getDriverLaps } from '../api/laps'
import type {DriverLap, SessionType} from '../types'

export const useLaps = (year?: number | null, round_number?: number | null, session_type?: SessionType | null, driver_abbrevation?: string | null) => {
	const [ loading, setLoading] = useState(false)
	const [ laps, setLaps ] = useState<DriverLap[]>([])
	const [ loadError, setLoadError ] = useState('')

	useEffect(() => {
		if (year == null || round_number == null || session_type == null || driver_abbrevation == null || driver_abbrevation == null ) return
		async function loadLaps(y: number, r: number, s: SessionType, d: string) {
			try {
				setLoadError('')
				setLoading(true)
				const data = await getDriverLaps(y, r, s, d)
				setLaps(data)
			} catch (err) {
				setLoadError(err instanceof Error ? err.message : "Unkwon error")
				setLaps([])
			} finally {
				setLoading(false)
			}
		}
		loadLaps(year, round_number, session_type, driver_abbrevation)
	}, [year, round_number, session_type, driver_abbrevation] )

	return {
		loading,
		loadError,
		laps
	}
}
