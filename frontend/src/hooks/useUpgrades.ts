import {useEffect, useState} from "react"
import {getUpgradesSummaries} from "../api/upgrades"
import type {TeamSummaries} from "../types"

export const useUpgrades = (year?: number | null, round_number?: number | null) => {
	const [ loading, setLoading] = useState(false)
	const [ upgradesSummaries, setUpgradesSummaries ] = useState<TeamSummaries | null>(null)
	const [ loadError, setLoadError ] = useState('')

	useEffect(() => {
		if (year == null|| round_number == null) return

		async function loadSummaries(y: number, r: number) {
			try {
				setLoading(true)
				setLoadError('')
				const data = await getUpgradesSummaries(y, r)
				setUpgradesSummaries(data)
			} catch (err) {
				setLoadError(err instanceof Error ? err.message : "Unkwon error")
				setUpgradesSummaries(null)
			} finally {
				setLoading(false)
			}
		}
		loadSummaries(year, round_number)
	}, [year, round_number] )

	return {
		loading,
		loadError,
		upgradesSummaries,
	}
}
