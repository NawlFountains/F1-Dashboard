import type { Schedule, SessionSchedule } from '../../types'
import {eventHasPassed, formatEventDateSpan} from '../../utils/date'

interface SchedulesRowProps {
	schedule: Schedule,
	onSelected: (schedule: Schedule) => void,
	onSessionSelected: (session: SessionSchedule) => void,
	isSelected: boolean,
	selectedSession?: SessionSchedule
}

export default function SchedulesRow( { schedule, onSelected, onSessionSelected, isSelected, selectedSession } : SchedulesRowProps ) {
	return (
		<div
			onClick={() => onSelected(schedule)}
			className={`
				flex flex-col border border-gruv-fg3 dark:border-gruv-bg3 bg-gruv-fg1 dark:bg-gruv-bg2 dark:text-gruv-fg2 
				${!isSelected && 'hover:border-gruv-orange hover:bg-gruv-orange/10' }
				rounded transition-all duration-300 cursor-pointer
			`}
		>
			<div className={`flex flex-row justify-between p-2 px-4
				${ isSelected && 'bg-gruv-orange text-gruv-fg2'}
				`}>
			<p className="font-mono">{schedule.event_name}</p>
			<p className='hidden md:block font-mono '>{schedule.location}, {schedule.country}</p>
			<div className={`flex flex-row gap-2
				`}
			>
				<p>{formatEventDateSpan(schedule?.sessions[0].date, schedule?.sessions[schedule?.sessions.length - 1].date)
}</p>
				<p className="text-nowrap">
					<span className='font-bold'>R: </span> 
					{schedule.round_number}
				</p>
			</div>
			</div>
			<div
				className={`grid transition-all duration-300 ease-in-out
					${isSelected ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
					`}
			>
			  <div className="overflow-hidden">
			    <div className="flex flex-col gap-1">
			      {schedule.sessions.map((session, index) => (
				      <button
					      key={`${session.date}-${index}`}
					      onClick={(e) => {
						      e.stopPropagation()
						      onSessionSelected(session)}
					      }
					      disabled={!eventHasPassed(session.date)}
					      className={`grid grid-cols-2 py-1 border border-gruv-orange/0 hover:bg-gruv-orange/10 hover:border-gruv-orange transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gruv-orange/0
						      ${selectedSession?.date === session?.date && 'bg-gruv-orange text-gruv-fg2'}
						      `}
					>

					  <p>{session.name}</p>
					  <p className='relative'>{ new Date(session.date).toLocaleString(undefined, {

						  hour: "numeric",
						  minute: "numeric",
						  day: "numeric",
						  month: "numeric",
						  hour12: false
					  })} 
						<span className='absolute right-4 font-bold'>{eventHasPassed(session.date) ? `>` : ''}</span>
					  </p>

					</button>
			      ))}
			    </div>
			  </div>
			</div>
		</div>
	)
}
