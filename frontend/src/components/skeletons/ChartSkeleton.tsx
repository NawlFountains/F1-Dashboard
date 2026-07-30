import React, {useMemo} from "react"
import { LineChart, Line, YAxis, ResponsiveContainer } from "recharts"

interface SkeletonLap {
	lap_number: number
	lap_time: number
}

function generateSkeletonLaps(count: number = 20): SkeletonLap[] {
	return Array.from({ length: count }, (_, i) => ({
		lap_number: i + 1,
		lap_time: 80 + Math.random() * 20,
	}))
}

export default function ChartSkeleton({ height = 200 }) {
	const skeletonData = useMemo(() => generateSkeletonLaps(), [])
	return (
		<ResponsiveContainer width='100%' height={height} className='animate-pulse'>
		<LineChart data={skeletonData} margin={{ top: 5, right: 20, left: 10, bottom: 10 }}>
		<YAxis dataKey="lap_time" domain={['dataMin - 15', 'dataMax + 15']} hide />
			<Line type="monotone" dataKey="lap_time" stroke="#555" dot={false} isAnimationActive={false} />
		</LineChart>
		</ResponsiveContainer>
	)
}
