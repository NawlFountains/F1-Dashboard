import type {ReactNode} from "react";

export default function QualifyingResultsTable({ children } : { children : ReactNode }) {
	return (
		<table className="w-full text-center">
		<thead>
			<tr className="bg-gruv-orange text-gruv-fg2 font-mono font-bold uppercase">
				<td className="py-2">
				<p>Position</p>
				</td>
				<td>
				<p>Driver</p>
				</td>
				<td className="hidden md:table-cell">
				<p>Q1</p>
				</td>
				<td className="hidden md:table-cell">
				<p>Q2</p>
				</td>
				<td>
				<p>Q3</p>
				</td>
			</tr>
		</thead>
		<tbody className="divide-y divide-gruv-fg4">
		{children}
		</tbody>
		</table>
	)
}
