import type {DriverRaceResult} from "../../../types"

interface RaceResultsRowProps {
	result: DriverRaceResult,
	raceLaps: number
}

export default function RaceResultsRow( { result, raceLaps }: RaceResultsRowProps ) {
	const formatedStatus = () => {
		if (result.status === 'Retired') return 'DNF'
		if (result.status === 'Did not start') return 'DNS'
		if (result.status === 'Lapped') return `+${raceLaps - result.laps} Laps`
		return result.status
	}

	const delta = result.position == 1 
		? result.time
		: `+${result.time}`


	return (
		<tr className="w-full">
			<td className="font-mono p-2">
			{result.position}
			</td>
			<td 
				style={{ color: `#${result.team_color}`}}
				className="font-mono bg-gruv-bg0 font-bold">
			{result.abbreviation}	
			</td>	
			<td className="hidden lg:table-cell">
			{formatedStatus() === 'Finished' ? delta : formatedStatus()}
			</td>
		</tr>
	)
}
