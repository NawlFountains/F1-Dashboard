import { useEffect, useState } from "react"
import { getPracticeResults, getQualifyingResults, getSprintOrRaceResults } from "../api/results"
import { isRaceSession, isQualifyingSession } from '../utils/guards'
import type { SessionResultsData, SessionType, PracticeSessionType } from "../types"

export function useSessionResults(year?: number | null, round_number?: number | null, session_type?: SessionType | null) {
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState<SessionResultsData | null>(null)
	const [loadError, setLoadError] = useState('')

	useEffect(() => {
		if (year == null|| round_number == null || session_type == null) return
		let ignore = false

		async function loadResults(y: number, r: number, s: SessionType) {
			try {
				setLoading(true)
				setLoadError('')

				let next: SessionResultsData
				if (isRaceSession(s)) {
					next = { kind: "race", results: await getSprintOrRaceResults(y, r, s) }
				} else if (isQualifyingSession(s)) {
					next = { kind: "qualifying", results: await getQualifyingResults(y, r, s) }
				} else {
					next = { kind: "practice", results: await getPracticeResults(y, r, s as PracticeSessionType) }
				}

				if (!ignore) setResults(next)
			} catch (err) {
				if (!ignore) {
					setLoadError(err instanceof Error ? err.message : "Unknown error")
					setResults(null)
				}
			} finally {
				if (!ignore) setLoading(false)
			}
		}

		loadResults(year, round_number, session_type)
		return () => { ignore = true }
	}, [year, round_number, session_type])

	return { loading, loadError, results }
}
