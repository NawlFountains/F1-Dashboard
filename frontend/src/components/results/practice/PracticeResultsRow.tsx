import type {DriverPracticeResult} from "../../../types"

interface PracticeResultsRowProps {
	result: DriverPracticeResult
}

export default function PracticeResultsRow( { result }: PracticeResultsRowProps ) {
	return (
		<tr className="w-full dark:text-gruv-fg2">
			<td 
				style={{ color: `#${result.team_color}`}}
				className="font-mono bg-gruv-bg0 font-bold">
			{result.abbreviation}	
			</td>	
		</tr>
	)
}
