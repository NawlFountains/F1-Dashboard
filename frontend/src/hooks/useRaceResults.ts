import {useEffect, useState} from "react"
import {getRaceResults} from "../api/results"
import type { DriverRaceResult } from "../types"

export const useRaceResults = (year?: number, round_number?: number) => {
	const [ loading, setLoading] = useState(false)
	const [ results, setResults ] = useState<DriverRaceResult[]>([])
	const [ loadError, setLoadError ] = useState('')

	useEffect(() => {
		if (!year || !round_number) return

		async function loadResults() {
			try {
				setLoading(true)
				setLoadError('')
				const data = await getRaceResults(year, round_number)
				setResults(data)
			} catch (err) {
				setLoadError(err instanceof Error ? err.message : "Unkwon error")
				setResults(null)
			} finally {
				setLoading(false)
			}
		}
		loadResults()
	}, [year, round_number] )

	return {
		loading,
		loadError,
		results
	}
}
