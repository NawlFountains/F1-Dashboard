import type {DriverPracticeResult} from "../../../types"

interface PracticeResultsRowProps {
	result: DriverPracticeResult
	onSelect: (driver: string) => void
}

export default function PracticeResultsRow( { result, onSelect }: PracticeResultsRowProps ) {
	return (
		<tr 
			onClick={() => onSelect(result.abbreviation)}
			className="w-full dark:text-gruv-fg2 cursor-pointer hover:text-gruv-fg2 hover:bg-gruv-orange">
			<td>
			{result.driver_number}
			</td>
			<td 
				style={{ color: `#${result.team_color}`}}
				className="font-mono bg-gruv-bg0 font-bold py-2">
			{result.abbreviation}	
			</td>	
			<td>
			</td>
		</tr>
	)
}
