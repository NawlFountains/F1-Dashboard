import type {ReactNode} from "react";

export default function RaceResultsTable({ children } : { children : ReactNode }) {
	return (
		<table className="w-full text-center">
		<tbody className="divide-y divide-gruv-fg4">
		{children}
		</tbody>
		</table>
	)
}
