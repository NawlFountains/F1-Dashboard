import { formatDuration } from '../../utils/time'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"
import type { DriverLap } from "../../types"

const COMPOUND_COLORS: Record<string, string> = {
	SOFT: "#e10600",
	MEDIUM: "#ffd700",
	HARD: "#f0f0f0",
	INTERMEDIATE: "#43b02a",
	WET: "#0067ad",
}

function CompoundDot(props: any) {
	const { cx, cy, payload } = props
	const color = COMPOUND_COLORS[payload.compound] ?? "#888888"
	if (payload.lap_time === null) return null
	return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#333" strokeWidth={1} />
}

export function LapChart({ laps }: { laps: DriverLap[] }) {
	return (
		<ResponsiveContainer width='100%' height={300}>
		<LineChart data={laps} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="lap_number" label="Lap number"/>
			<YAxis dataKey="lap_time" label="Lap time" domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={formatDuration} reversed/>
			<Tooltip />
			<Line type="monotone" dataKey="lap_time" stroke="#8884d8" dot={<CompoundDot />} connectNulls/>
		</LineChart>
		</ResponsiveContainer>
	)
}
