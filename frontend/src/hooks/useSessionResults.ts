import { useEffect, useState } from "react"
import { getPracticeResults, getQualifyingResults, getSprintOrRaceResults } from "../api/results"
import { isRaceSession, isQualifyingSession } from '../utils/guards'
import type { SessionResultsData, SessionType, PracticeSessionType } from "../types"

export function useSessionResults(year?: number, round_number?: number, session_type?: SessionType) {
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState<SessionResultsData | null>(null)
	const [loadError, setLoadError] = useState('')

	useEffect(() => {
		if (!year || !round_number || !session_type) return
		let ignore = false

		async function loadResults() {
			try {
				setLoading(true)
				setLoadError('')

				let next: SessionResultsData
				if (isRaceSession(session_type)) {
					next = { kind: "race", results: await getSprintOrRaceResults(year, round_number, session_type) }
				} else if (isQualifyingSession(session_type)) {
					next = { kind: "qualifying", results: await getQualifyingResults(year, round_number, session_type) }
				} else {
					next = { kind: "practice", results: await getPracticeResults(year, round_number, session_type as PracticeSessionType) }
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

		loadResults()
		return () => { ignore = true }
	}, [year, round_number, session_type])

	return { loading, loadError, results }
}
