import {ReactNode} from "react";

export default function UpgradesTable({ children } : { children : ReactNode }) {
	return (
		<table className="w-full text-center ">
		<tbody className="divide-y divide-gruv-fg4">
		{children}
		</tbody>
		</table>
	)
}
