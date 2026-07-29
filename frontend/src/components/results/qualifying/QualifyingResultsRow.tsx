import type {DriverQualifyingResult} from "../../../types"

interface QualifyingResultsRowProps {
	result: DriverQualifyingResult
}

export default function QualifyingResultsRow( { result }: QualifyingResultsRowProps ) {

	return (
		<tr className="w-full dark:text-gruv-fg2">
			<td className="font-mono p-2">
			{result.position}
			</td>
			<td 
				style={{ color: `#${result.team_color}`}}
				className="font-mono bg-gruv-bg0 font-bold">
			{result.abbreviation}	
			</td>	
			<td className="hidden md:table-cell">
			{result.q1}
			</td>
			<td className="hidden md:table-cell">
			{result.q2}
			</td>
			<td>
			{result.q3}
			</td>
		</tr>
	)
}
