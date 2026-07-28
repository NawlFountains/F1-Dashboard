interface UpgradesRowProps {
	team: string,
	summary: string
}

export default function UpgradesRow( {team, summary}: UpgradesRowProps ) {
	return (
		<tr>
			<td className="font-mono bg-gruv-orange px-2 text-gruv-fg2 font-bold">
			{team}	
			</td>
			<td className="text-sm p-2">
			{summary}
			</td>
		</tr>
	)
}
