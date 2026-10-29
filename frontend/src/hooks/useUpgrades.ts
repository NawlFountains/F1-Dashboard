import {useEffect, useState} from "react"
import {getUpgradesSummaries} from "../api/upgrades"
import type { TeamSummariesResponse } from "../types"

export const useUpgrades = (year?: number | null, round_number?: number | null) => {
	const [ loading, setLoading] = useState(false)
	const [ data, setData ] = useState<TeamSummariesResponse | null>(null)
	const [ loadError, setLoadError ] = useState('')

	useEffect(() => {
		if (year == null|| round_number == null) return

		let cancelled = false

		async function loadSummaries(y: number, r: number) {
			try {
				setLoading(true)
				setLoadError('')
				const res = await getUpgradesSummaries(y, r)
				if (!cancelled) setData(res)
			} catch (err) {
				if (cancelled) return
				setLoadError(err instanceof Error ? err.message : "Unknown error")
				setData(null)
			} finally {
				if (!cancelled) setLoading(false)
			}
        }

        loadSummaries(year, round_number)
        return () => { cancelled = true }
	}, [year, round_number] )

	return {
		loading,
		loadError,
		meta: data?.meta ?? null,
		teams: data?.teams ?? null,
	}
}
