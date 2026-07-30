import React, {ReactNode} from "react";

export default function LapsTable({ children } : { children: ReactNode}) {
	return (
		<table className="w-full text-center">
		<thead className="dark:text-gruv-fg2 bg-gruv-orange font-mono">
			<tr>
			<td className="py-2">
			<p>Lap Number</p>
			</td>
			<td>
			<p>Lap time</p>
			</td>
			<td className='hidden md:table-cell'>
			Sector 1
			</td>
			<td className='hidden md:table-cell'>
			Sector 2
			</td>
			<td className='hidden md:table-cell'>
			Sector 3
			</td>
			<td>
			<p>Compound</p>
			</td>
			<td className='hidden md:table-cell'>
			<p>Tyre life</p>
			</td>
			</tr>
		</thead>
		<tbody>
			{children}
		</tbody>
		</table>
	)
}
