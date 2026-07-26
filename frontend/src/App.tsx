import ScreenLayout from "./layouts/ScreenLayout"
import {useSchedules} from "./hooks/useSchedules"
import {useState} from "react"
import {useSummaries} from "./hooks/useSummaries"
import {useRaceResults} from "./hooks/useRaceResults"

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
				<div className="ml-4 border rounded bg-gruv-fg2 divide-x px-2">
								<input
									value={year}
									onChange={(e) => setYear(Number(e.target.value))}
									placeholder="year"
									min="1955"
									max={new Date().getFullYear() + 1}
									type="number"
									className=""
								/>
								<input
									value={roundNumber}
									onChange={(e) => setRoundNumber(Number(e.target.value))}
									placeholder="round"
									min="1"
									max="20"
									type="number"
									className=""
								/>
								<button
									onClick={() => {
										setAppliedYear(year),
										setAppliedRoundNumber(roundNumber)
									}}
									className="rounded border border-gruv-orange px-3">
									Search
								</button>
							</div>
			</div>
		
			<div className="grid grid-cols-5 w-full gap-5">
				<div className="col-span-4 w-full bg-gruv-fg2 flex flex-col">

									{activeTab === 'schedules' && (
						<div>
							{/* Full Schedule */}
							<h2>Full schedules</h2>
							<div className="grid grid-cols-4 gap-2">
							{schedules.map(schedule => (
								<div className="flex flex-col p-2 border border-gruv-orange">
								<p>{schedule.event_name}</p>
								<p>{new Date(schedule.event_date).toLocaleString()}</p>
								</div>
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
				<div className="flex flex-col bg-gruv-fg2">
					Leaderboard
					{resultsLoading ? (
						<p>Loading race results</p>
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
