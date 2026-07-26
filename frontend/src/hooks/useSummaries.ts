import {useEffect, useState} from "react"
import {getUpgradesSummaries} from "../api/upgrades"
import type {TeamSummaries} from "../types"

export const useSummaries = (year?: number, round_number?: number) => {
	const [ loading, setLoading] = useState(false)
	const [ summaries, setSummaries ] = useState<TeamSummaries>()
	const [ loadError, setLoadError ] = useState('')

	useEffect(() => {
		if (!year || !round_number) return

		async function loadSummaries() {
			try {
				setLoading(true)
				setLoadError('')
				const data = await getUpgradesSummaries(year, round_number)
				setSummaries(data)
			} catch (err) {
				setLoadError(err instanceof Error ? err.message : "Unkwon error")
				setSummaries(null)
			} finally {
				setLoading(false)
			}
		}
		loadSummaries()
	}, [year, round_number] )

	return {
		loading,
		loadError,
		summaries,
	}
}
