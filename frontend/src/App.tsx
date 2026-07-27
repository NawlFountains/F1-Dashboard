import { useMemo } from "react"
import ScreenLayout from "./layouts/ScreenLayout"
import {useSchedules} from "./hooks/useSchedules"
import {useEffect, useState} from "react"
import {useSummaries} from "./hooks/useSummaries"
import {useRaceResults} from "./hooks/useRaceResults"
import {LoadingSpinner} from "./components/styles/Icons"
import {Card} from "./components/Card"
import SummariesTable from "./components/summaries/SummariesTable"
import SummariesRow from "./components/summaries/SummariesRow"
import RaceResultsTable from "./components/results/race/RaceResultsTable"
import RaceResultsRow from "./components/results/race/RaceResultsRow"
import type { Schedule } from "./types"

function App() {

	const [ activeTab, setActiveTab ] = useState<'schedules' | 'results' | 'summaries'>('schedules')

	const {
		schedules,
		currentSchedule,
		loading: schedulesLoading,
		loadError: schedulesLoadError
	} = useSchedules()

	const [ appliedYear, setAppliedYear ] = useState<number>(null)
	const [ appliedRoundNumber, setAppliedRoundNumber ] = useState<number>(null)

	const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)

	useEffect(() => {
		if (currentSchedule && !selectedSchedule) {
			setSelectedSchedule(currentSchedule)
			setAppliedYear(new Date(currentSchedule.event_date).getFullYear())
			setAppliedRoundNumber(currentSchedule.round_number)
		}
	}, [currentSchedule])

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

	const leaderLaps = useMemo(() => results?.[0]?.laps ?? 0, [results])

  return (
    <>
    	<ScreenLayout>
		<div className='relative w-full bg-gruv-red text-gruv-fg1 dark:bg-gruv-bg1 text-center py-2'>
			<div
				className="absolute top-2 right-4 flex flex-row 
				border border-[--pattern-fg]">
			<input
				placeholder="Search CTRL + K"
				className="px-2 rounded"
			/>
			</div>
			<h1 className="text-2xl font-bold font-mono">
				F1 - Dashboard
			</h1>
			
		</div>

		<div className="mx-5 py-2">
			{selectedSchedule && (
				<Card>
					<div className="flex flex-row font-mono justify-between items-center">
						<h2 className="text-nowrap px-2">{selectedSchedule?.event_name}</h2>
						<div className="w-full max-w-lg h-px bg-gruv-orange"/>
						<p className="text-nowrap px-2">{new Date(selectedSchedule?.event_date).toLocaleDateString()} <span className="font-bold uppercase">Round:</span>{selectedSchedule?.round_number}</p>
					</div>
				</Card>
			)}
		</div>

		<div className="p-2 px-5">
			<div className="flex flex-row gap-2">
				<button
					onClick={() => setActiveTab("schedules")}
					className={`rounded-t px-2 py-1 ${activeTab === "schedules" ? 'bg-gruv-fg2' : 'shadow-md shadow-neutral-900'}`}
				>
					Schedule
				</button>
				<button
					onClick={() => setActiveTab("summaries")}
					className={`rounded-t px-2 py-1 ${activeTab === "summaries" ? 'bg-gruv-fg2' : 'shadow-md shadow-neutral-900'}`}
				>
					Summaries
				</button>
			</div>
		
			<div className="grid grid-cols-5 w-full gap-5">
				<div className="col-span-4 w-full bg-gruv-fg2 flex flex-col rounded-r rounded-b overflown-hidden">

									{activeTab === 'schedules' && (
						<div>
							{/* Full Schedule */}
							<div className="grid grid-cols-3 gap-2 m-2">
							{schedules.map(schedule => (
								<button
									onClick={() => {
										setAppliedYear(new Date(schedule.event_date).getFullYear()),
										setAppliedRoundNumber(schedule.round_number)
										setSelectedSchedule(schedule)
									}}
									className={`
										flex flex-col p-2 px-4 border border-gruv-orange bg-gruv-fg1 rounded 
										${schedule?.event_name == selectedSchedule?.event_name
											? 'bg-gruv-orange text-gruv-fg2' 
											: 'hover:bg-gruv-orange hover:text-gruv-fg2 ' }
										transition-all duration-300 cursor-pointer
									`}
								>
									<div className="flex flex-row justify-between border-b pb-1">
										<p className="font-mono text-lg">{schedule.event_name}</p>
										<p className="text-nowrap">R: {schedule.round_number}</p>
									</div>
								<p>{new Date(schedule.event_date).toLocaleDateString()}</p>
								</button>
							))}
							</div>
						</div>
					)}

					{activeTab === 'summaries' && (
						<>
						{summariesLoading ? (
							<LoadingSpinner/>
						) : (
						<div>
							<SummariesTable>
								{summaries && Object.entries(summaries).map(([team, summary]) => (
									<SummariesRow key={team} team={team} summary={summary}/>
								))}
							</SummariesTable>	
							{summariesLoadError && (
								<p>{summariesLoadError}</p>
							)}
						</div>
						)}
						</>
					)}
				</div>
				<Card
					padding="sm">
					<h2 className="text-center font-mono py-2">Leaderboard</h2>
					<div className="h-0.5 w-full bg-gruv-orange/40 mb-2"/>
					{resultsLoading ? (
						<LoadingSpinner size={50}/>
					): (
						<RaceResultsTable>
							{results?.map((result, index) => (
								<RaceResultsRow key={index} result={result} raceLaps={leaderLaps} />
							))}
						</RaceResultsTable>
					)}
				</Card>
			</div>
		</div>
	</ScreenLayout>
    </>
  )
}

export default App
