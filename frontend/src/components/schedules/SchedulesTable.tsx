import {ReactNode} from "react";

export default function ScheduleTable({ children } : { children : ReactNode }) {
	return (
		<div className="flex flex-col gap-2 m-2">
		{children}
		</div>
	)
}
