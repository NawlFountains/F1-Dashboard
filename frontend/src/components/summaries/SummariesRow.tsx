interface SummariesRowProps {
	team: string,
	summary: string
}

export default function SummariesRow( {team, summary}: SummariesRowProps ) {
	return (
		<tr>
			<td className="font-mono bg-gruv-orange text-gruv-fg2">
			{team}	
			</td>
			<td className="text-sm p-2">
			{summary}
			</td>
		</tr>
	)
}
