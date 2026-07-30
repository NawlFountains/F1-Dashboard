import { formatDuration } from "../../../utils/time"
import type {DriverQualifyingResult} from "../../../types"

interface QualifyingResultsRowProps {
	result: DriverQualifyingResult
	onSelect: (driver: string) => void
}

export default function QualifyingResultsRow( { result, onSelect }: QualifyingResultsRowProps ) {

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
			<td className="hidden md:table-cell">
			{formatDuration(result.q1)}
			</td>
			<td className="hidden md:table-cell">
			{formatDuration(result.q2)}
			</td>
			<td>
			{formatDuration(result.q3)}
			</td>
		</tr>
	)
}
