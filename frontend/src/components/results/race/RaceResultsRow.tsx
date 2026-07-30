import { formatDuration } from "../../../utils/time"
import type {DriverRaceResult} from "../../../types"

interface RaceResultsRowProps {
	result: DriverRaceResult,
	raceLaps: number,
	onSelect: (driver: string) => void
}

export default function RaceResultsRow( { result, raceLaps, onSelect }: RaceResultsRowProps ) {
	const formatedStatus = () => {
		if (result.status === 'Retired') return 'DNF'
		if (result.status === 'Did not start') return 'DNS'
		if (result.status === 'Lapped') return `+${raceLaps - result.laps} Laps`
		return result.status
	}

	const delta = result.position == 1 
		? formatDuration(result.time)
		: `+${formatDuration(result.time)}`


	return (
		<tr 
			onClick={() => onSelect(result.abbreviation)}
			className="w-full dark:text-gruv-fg2 cursor-pointer hover:text-gruv-fg2 hover:bg-gruv-orange">
			<td className="font-mono p-2">
			{result.position}
			</td>
			<td 
				style={{ color: `#${result.team_color}`}}
				className="font-mono bg-gruv-bg0 font-bold">
			{result.abbreviation}	
			</td>	
			<td>
			{formatedStatus() === 'Finished' ? delta : formatedStatus()}
			</td>
			<td className="hidden md:table-cell">
			{result.laps}
			</td>
		</tr>
	)
}
