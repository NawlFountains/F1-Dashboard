import React from 'react'
import type {DriverLap} from '../../types'
import { formatDuration } from '../../utils/time'

interface LapsRowProps {
	lap: DriverLap
}

export default function LapsRow( { lap } : LapsRowProps ) {
	const compoundColor = (): string => {
		switch (lap.compound) {
			case 'MEDIUM':
				return 'text-gruv-yellow'
			case 'SOFT':
				return 'text-gruv-red'
			case 'HARD':
				return 'text-gruv-gray'
			case 'INTERMEDIATE':
				return 'text-gruv-green'
			case 'WET':
				return 'text-gruv-blue'
			default:
				return 'text-gruv-fg2'
		}
	}

	return (
		<tr className={`dark:text-gruv-fg2 ${lap.is_personal_best ? 'bg-gruv-purple' : '' }`}>
		<td>
			{lap.lap_number}
		</td>
		<td>
			{formatDuration(lap.lap_time)}
		</td>
		<td className='hidden md:table-cell'>
			{formatDuration(lap.sector_1_time)}
		</td>
		<td className='hidden md:table-cell'>
			{formatDuration(lap.sector_2_time)}
		</td>
		<td className='hidden md:table-cell'>
			{formatDuration(lap.sector_3_time)}
		</td>
		<td className={`${compoundColor()} font-bold`}>
			<p className='sm:hidden'>{lap.compound.substring(0,1)}</p>
			<p className='hidden sm:table-cell'>{lap.compound}</p>
		</td>
		<td className='hidden md:table-cell'>
			{lap.tyre_life}
		</td>
		</tr>
	)
}
