import { useMemo } from "react"
import ScreenLayout from "./layouts/ScreenLayout"
import {useSchedules} from "./hooks/useSchedules"
import {useEffect, useState} from "react"
import {useUpgrades} from "./hooks/useUpgrades"
import {useRaceResults} from "./hooks/useRaceResults"
import {LoadingSpinner} from "./components/styles/Icons"
import {Card} from "./components/Card"
import UpgradesTable from "./components/upgrades/UpgradesTable"
import UpgradesRow from "./components/upgrades/UpgradesRow"
import RaceResultsTable from "./components/results/race/RaceResultsTable"
import RaceResultsRow from "./components/results/race/RaceResultsRow"
import type { Schedule } from "./types"
import ScheduleTable from "./components/schedules/SchedulesTable"
import SchedulesRow from "./components/schedules/SchedulesRow"
import { formatDate } from "./utils/date"
import ButtonTab from "./components/ButtonTab"

function App() {
	const [ activeTab, setActiveTab ] = useState<'schedules' | 'results' | 'upgrades'>('schedules')
	const [ appliedYear, setAppliedYear ] = useState<number>(new Date().getFullYear())
	const [ appliedRoundNumber, setAppliedRoundNumber ] = useState<number>(null)

	const {
		schedules,
		currentSchedule,
		loading: schedulesLoading,
		loadError: schedulesLoadError
	} = useSchedules(appliedYear)


	const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)

	useEffect(() => {
		if (currentSchedule && !selectedSchedule) {
			setSelectedSchedule(currentSchedule)
			setAppliedYear(new Date(currentSchedule.event_date).getFullYear())
			setAppliedRoundNumber(currentSchedule.round_number)
		}
	}, [currentSchedule])

	const {
		loading: upgradesLoading,
		loadError: upgradesLoadError,
		upgradesSummaries,
	} = useUpgrades(appliedYear, appliedRoundNumber)

	const {
		loading: resultsLoading,
		loadError: resultsLoadError,
		results,
	} = useRaceResults(appliedYear, appliedRoundNumber)

	const CURRENT_YEAR = new Date().getFullYear()
	const EARLIEST_YEAR = 2018 

	const yearOptions = Array.from(
		{ length: CURRENT_YEAR - EARLIEST_YEAR + 1 },
		(_, i) => CURRENT_YEAR - i
	)

	const leaderLaps = useMemo(() => results?.[0]?.laps ?? 0, [results])

  return (
    <>
    	<ScreenLayout>
		<div className='relative w-full bg-gruv-red text-gruv-fg1 dark:bg-gruv-bg1 text-center py-2'>
			<div
				className="hidden md:absolute top-2 right-4 flex flex-row 
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
					<div className="flex flex-col gap-2 md:flex-row font-mono justify-between items-center">
						<h2 className="text-nowrap px-2">{selectedSchedule?.event_name}</h2>
						<div className="w-full max-w-lg h-px bg-gruv-orange"/>
						<p className="text-nowrap px-2">{formatDate(selectedSchedule?.event_date)} <span className="font-bold uppercase">Round:</span>{selectedSchedule?.round_number}</p>
					</div>
				</Card>
			)}
		</div>

		<div className="p-2 px-5">
				<div className="flex flex-row gap-2">
				<div className="flex flex-row">
				<ButtonTab
					onSelect={() => setActiveTab("schedules")}
					isSelected={activeTab === "schedules"}
					name="Schedules"
				/>
				<select 
					className={`px-2 dark:text-gruv-fg2 font-mono rounded-r
						${activeTab === "schedules" ? 'bg-gruv-fg2 dark:bg-gruv-bg1' : ''}`}
					value={appliedYear} 
					onChange={(e) => setAppliedYear(Number(e.target.value))}
				>
					{yearOptions.map(y => (
						<option key={y} value={y} className="bg-gruv-fg2 dark:bg-gruv-bg1">{y}</option>
					))}
				</select>
				</div>
				<ButtonTab
					onSelect={() => setActiveTab("upgrades")}
					isSelected={activeTab === "upgrades"}
					name="Upgrades"
				/>
				<div className="md:hidden">
				<ButtonTab 
					onSelect={() => setActiveTab("results")}
					isSelected={activeTab === "results"}
					name="Results"
				/>
				</div>	
				
			</div>
		
			<div className="grid grid-cols-1 md:grid-cols-5 w-full gap-5">
				<div className="col-span-4 w-full bg-gruv-fg2 dark:bg-gruv-bg1 flex flex-col rounded-r rounded-b overflown-hidden">

					{/* Full Schedule */}
					{activeTab === 'schedules' && (
						<>
						{schedulesLoading ? (
							<LoadingSpinner/>
						): (
							<ScheduleTable>
							{schedules.map(schedule => (
								<SchedulesRow 
									key={schedule.event_date} 
									onSelected={() => {
										setAppliedYear(new Date(schedule.event_date).getFullYear()),
										setAppliedRoundNumber(schedule.round_number)
										setSelectedSchedule(schedule)

									}}
									onSessionSelected={() => alert(`Session ${schedule.location}`)}
									isSelected={schedule?.event_date == selectedSchedule?.event_date}
									schedule={schedule}/>
							))}
							</ScheduleTable>
						)}
						{schedulesLoadError && (
							<p>{schedulesLoadError}</p>
						)}
						</>
					)}

					{activeTab === 'upgrades' && (
						<>
						{upgradesLoading ? (
							<LoadingSpinner/>
						) : (
						<div>
							<UpgradesTable>
								{upgradesSummaries && Object.entries(upgradesSummaries).map(([team, summary]) => (
									<UpgradesRow key={team} team={team} summary={summary}/>
								))}
							</UpgradesTable>	
							{upgradesLoadError && (
								<p>{upgradesLoadError}</p>
							)}
						</div>
						)}
						</>
					)}

					{activeTab === 'results' && (
						<>
						{resultsLoading ? (
							<LoadingSpinner />
						): (
									<RaceResultsTable>
										{results?.map((result, index) => (
											<RaceResultsRow key={index} result={result} raceLaps={leaderLaps} />
										))}
									</RaceResultsTable>
						)}
						</>
					)}
				</div>
				<Card
					className="hidden md:block"
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
