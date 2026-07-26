import ScreenLayout from "./layouts/ScreenLayout"
import {useSchedules} from "./hooks/useSchedules"
import {useState} from "react"
import {useSummaries} from "./hooks/useSummaries"
import {useRaceResults} from "./hooks/useRaceResults"
import {LoadingSpinner} from "./components/styles/Icons"

function App() {

	const [ activeTab, setActiveTab ] = useState<'schedules' | 'results' | 'summaries'>('schedules')

	const {
		schedules,
		currentSchedule,
		loading,
		loadError
	} = useSchedules()

	const [ year, setYear] = useState<number>(null)
	const [ roundNumber, setRoundNumber ] = useState<number>(null)

	const [ appliedYear, setAppliedYear ] = useState<number>(null)
	const [ appliedRoundNumber, setAppliedRoundNumber ] = useState<number>(null)

	const [ selectedScheduleIndex, setSelectedScheduleIndex ] = useState<number>(null)

	const {
		loading: summariesLoading,
		loadError: summariesLoadError,
		summaries,
	} = useSummaries(appliedYear, appliedRoundNumber)

	const {
		loading: resultsLoading,
		loadError: resultsLoadError,
		results,
	} = useRaceResults(appliedYear, appliedRoundNumber)

  return (
    <>
    	<ScreenLayout>
		<div className='relative w-full bg-gruv-fg1 dark:bg-gruv-bg1 text-center py-2'>
			<div
				className="absolute top-2 right-4 flex flex-row 
				border border-[--pattern-fg]">
			<input
				placeholder="Search CTRL + K"
				className="px-2 rounded"
			/>
			</div>
			<h1 className="text-2xl text-bold font-mono">
				F1 - Dashboard
			</h1>
			
		</div>

		{/* Current GP */}
		<div className="flex flex-col bg-gruv-fg0">
			<h2>{currentSchedule?.event_name}</h2>
			{currentSchedule?.sessions.map(session => (
				<div 
					key={session.date}
					className="flex flex-row justify-between">
				<p>{session.name}</p>
				<p>{new Date(session.date).toLocaleString()}</p>
				</div>
			))}
		</div>

		<div className="p-2 px-5">
			<div className="flex flex-row">
				<button
					onClick={() => setActiveTab("schedules")}
					className={`px-2 ${activeTab === "schedules" ? 'bg-gruv-orange text-gruv-fg1' : 'border border-gruv-orange/40'}`}
				>
					Schedule
				</button>
				<button
					onClick={() => setActiveTab("summaries")}
					className={`px-2 ${activeTab === "summaries" ? 'bg-gruv-orange text-gruv-fg1' : 'border border-gruv-orange/40'}`}
				>
					Summaries
				</button>
			</div>
		
			<div className="grid grid-cols-5 w-full gap-5">
				<div className="col-span-4 w-full bg-gruv-fg2 flex flex-col">

									{activeTab === 'schedules' && (
						<div>
							{/* Full Schedule */}
							<div className="grid grid-cols-3 gap-2 m-2">
							{schedules.map((schedule, index) => (
								<button
									onClick={() => {
										setAppliedYear(new Date(schedule.event_date).getFullYear()),
										setAppliedRoundNumber(schedule.round_number)
										setSelectedScheduleIndex(index)
									}}
									className={`
										flex flex-col p-2 border border-gruv-orange 
										${index == selectedScheduleIndex 
											? 'bg-gruv-orange text-gruv-fg2' 
											: 'hover:bg-gruv-orange hover:text-gruv-fg2 ' }
										transition-all duration-300 cursor-pointer
									`}
								>
									<div className="flex flex-row justify-between border-b pb-1">
										<p>{schedule.event_name}</p>
										<p>R: {schedule.round_number}</p>
									</div>
								<p>{new Date(schedule.event_date).toLocaleString()}</p>
								</button>
							))}
							</div>
						</div>
					)}

					{activeTab === 'summaries' && (
						<div>
							
							<table className="w-full text-center">
							<thead>
								<tr>
								<td className="w-1/5">
								Team
								</td>
								<td>
								Summary
								</td>
								</tr>
							</thead>
							<tbody>
							{summaries && Object.entries(summaries).map(([team, summary]) => (
								  <tr 
									key={team}
									className="border p-2 divide-x"
								  >
								    <td>{team}</td>
								    <td>{summary}</td>
								  </tr>
								))}

							</tbody>
							</table>
							{summariesLoadError && (
								<p>{summariesLoadError}</p>
							)}
						</div>
					)}
				</div>
				<div className="flex flex-col bg-gruv-fg2 items-center text-center divide-y divide-gruv-orange gap-2">
					<h2 className="text-center font-mono py-2">Leaderboard</h2>
					{resultsLoading ? (
						<LoadingSpinner size={50}/>
					): (
						<table>
						<tbody>
							{results?.map((result, index) => (
								<tr key={index}>
									<td>{result.abbreviation}</td>
									<td>{result.position}</td>
									<td className="hidden lg:block">{result.time ?? result.status}</td>
								</tr>
							))}
						</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	</ScreenLayout>
    </>
  )
}

export default App
