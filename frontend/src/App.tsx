import { useMemo } from "react"
import ScreenLayout from "./layouts/ScreenLayout"
import {useSchedules} from "./hooks/useSchedules"
import {useEffect, useState} from "react"
import {useUpgrades} from "./hooks/useUpgrades"
import {useSessionResults} from "./hooks/useSessionResults"
import {LoadingSpinner} from "./components/styles/Icons"
import {Card} from "./components/Card"
import UpgradesTable from "./components/upgrades/UpgradesTable"
import UpgradesRow from "./components/upgrades/UpgradesRow"
import type { SessionType, Schedule, SessionSchedule } from "./types"
import ScheduleTable from "./components/schedules/SchedulesTable"
import SchedulesRow from "./components/schedules/SchedulesRow"
import { formatDate } from "./utils/date"
import ButtonTab from "./components/ButtonTab"
import parseSessionNameToShort from "./utils/session_parser"
import {ResultsPanel} from "./components/results/ResultsPanel"
import {useLaps} from "./hooks/useLaps"
import LapsTable from "./components/laps/LapsTable"
import LapsRow from "./components/laps/LapsRow"
import {LapChart} from "./components/laps/LapChart"
import TableSkeleton from "./components/skeletons/TableSkeleton"
import ChartSkeleton from "./components/skeletons/ChartSkeleton"

function App() {
	const [ activeTab, setActiveTab ] = useState<'schedules' | 'results' | 'upgrades' | 'laps'>('schedules')
	const [ appliedYear, setAppliedYear ] = useState<number>(new Date().getFullYear())
	const [ appliedRoundNumber, setAppliedRoundNumber ] = useState<number>(null)
	const [ appliedSessionType, setAppliedSessionType ] = useState<SessionType>(null)

	const {
		schedules,
		currentSchedule,
		loading: schedulesLoading,
		loadError: schedulesLoadError
	} = useSchedules(appliedYear)


	const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
	const [selectedSession, setSelectedSession ] = useState<SessionSchedule | null>(null)
	const [selectedDriver, setSelectedDriver] = useState<string | null> (null)

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
	} = useSessionResults(appliedYear, appliedRoundNumber, appliedSessionType)

	const {
		loading: lapsLoading,
		loadError: lapsLoadError,
		laps
	} = useLaps(appliedYear, appliedRoundNumber, appliedSessionType, selectedDriver)

	const CURRENT_YEAR = new Date().getFullYear()
	const EARLIEST_YEAR = 2018 

	const yearOptions = Array.from(
		{ length: CURRENT_YEAR - EARLIEST_YEAR + 1 },
		(_, i) => CURRENT_YEAR - i
	)

	const leaderLaps = useMemo(() => {
		if (results?.kind !== "race") return 0
		return results.results[0]?.laps ?? 0
	}, [results])

	// Handlers
	
	const handleDriverSelect = (driver_abbrevation: string) => {
		setSelectedDriver(driver_abbrevation)
		setActiveTab('laps')
	}

	const handleScheduleSelect = (schedule: Schedule) => {
		setAppliedYear(new Date(schedule.event_date).getFullYear()),
		setAppliedRoundNumber(schedule.round_number)
		setSelectedDriver(null)
		setSelectedSchedule(schedule)
	}

	const handleSessionSelect = (session: SessionSchedule) => {
		setSelectedSession(session)
		setSelectedDriver(null)
		setAppliedSessionType(parseSessionNameToShort(session?.name) as SessionType)
		setActiveTab("results")
	}

	const handleSetCurrentSchedule = () => {
		setSelectedSchedule(currentSchedule)
		setSelectedDriver(null)
		setAppliedSessionType(null)
		setActiveTab("schedules")
	}

	const isViewingCurrentSchedule =
		selectedSchedule?.round_number === currentSchedule?.round_number &&
		new Date(selectedSchedule?.event_date ?? 0).getFullYear() === new Date(currentSchedule?.event_date ?? 0).getFullYear()

  return (
    <>
    	<ScreenLayout>
		<div className='relative w-full bg-gruv-red dark:bg-gruv-bg1 text-center font-mono py-2'>
			<h1 className="text-2xl text-gruv-fg1 font-bold">
				F1 - Dashboard
			</h1>
			{!isViewingCurrentSchedule && (
				<button
					onClick={handleSetCurrentSchedule}
					className="absolute right-2 top-2 py-1 px-2 rounded bg-gruv-fg2 dark:text-gruv-fg1 dark:bg-gruv-bg2 hover:bg-gruv-orange cursor-pointer">
					<p>Next GP</p>
				</button>
			)}
			
		</div>


		{/* Information about selected schedule */}
		<div className="mx-5 py-2">
			{selectedSchedule && (
				<Card>
					
					<div className="flex flex-col gap-2 md:flex-row font-mono justify-between items-center">
						{isViewingCurrentSchedule && (
							<h2 className="text-nowrap">Next GP:</h2>
						)}
						<div className="flex flex-col md:flex-row text-nowrap text-center">
						<h2 className="px-2 font-bold">
						{selectedSchedule?.event_name}
						</h2>
						</div>
						<div className="flex flex-row w-full justify-center items-center">
						<div className="flex-1 h-px bg-gruv-orange"/>
						{selectedSession && (
							<p className="flex font-base justify-center px-2">{selectedSession.name}</p>
						)}	
						<div className="flex-1 h-px bg-gruv-orange"/>
						</div>
						<p className="text-nowrap px-2">{formatDate(selectedSchedule?.event_date)} <span className="font-bold uppercase">Round:</span>{selectedSchedule?.round_number}</p>
						
					</div>
				</Card>
			)}
		</div>

		<div className="p-2 px-5">

			{/* Mobile Tab section*/}
			<div className="grid grid-cols-2 gap-2 sm:hidden">
			<select 
				value={activeTab}
				onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
				className={`flex flex-row gap-2 w-full text-center text-lg py-2 mb-2 bg-gruv-orange rounded dark:text-gruv-fg2 font-mono
					${activeTab === 'schedules' ? 'col-span-1' : 'col-span-2'}
					`}>
				<option value="schedules" className="bg-gruv-bg1">Schedules</option>
				{upgradesSummaries && Object.entries(upgradesSummaries).length > 0 && 
					<option value="upgrades" className="bg-gruv-bg1">Upgrades</option>
				}
				{selectedSession && 
					<option value="results" className="bg-gruv-bg1">Results</option>
				}
				{selectedDriver && 
					<option value="laps" className="bg-gruv-bg1">Laps</option>
				}
				</select>

			{activeTab === "schedules" && <select 
				className={`px-2 mb-2 text-center dark:text-gruv-fg2 font-mono rounded-r
					${activeTab === "schedules" ? 'bg-gruv-fg2 dark:bg-gruv-bg1' : ''}`}
				value={appliedYear} 
				onChange={(e) => setAppliedYear(Number(e.target.value))}
			>
				{yearOptions.map(y => (
					<option key={y} value={y} className="bg-gruv-fg2 dark:bg-gruv-bg1">{y}</option>
				))}
				</select>
			}
			</div>

			{/* Desktop Tab section */}
			<div className="hidden sm:flex sm:flex-row sm:gap-2">
				<ButtonTab
					onSelect={() => setActiveTab("schedules")}
					isSelected={activeTab === "schedules"}
					name="Schedules"
				>
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
				</ButtonTab>
				<div className={` ${upgradesSummaries && Object.entries(upgradesSummaries).length > 0 
						? `flex`
						: `hidden` }`}
				>
				<ButtonTab
					onSelect={() => setActiveTab("upgrades")}
					isSelected={activeTab === "upgrades"}
					name="Upgrades"
				/>
				</div>
				<div className={`${selectedSession ? 'block' : 'hidden'}`}>
				<ButtonTab 
					onSelect={() => setActiveTab("results")}
					isSelected={activeTab === "results"}
					name="Results"
				/>
				</div>
				<div className={`${selectedDriver ? 'block' : 'hidden'}`}>
				<ButtonTab 
					onSelect={() => setActiveTab("laps")}
					isSelected={activeTab === "laps"}
					name="Laps"
				/>
				</div>
			</div>
		
			<div className="flex flex-col w-full">
				<div className="col-span-4 w-full bg-gruv-fg2 dark:bg-gruv-bg1 flex flex-col rounded-r rounded-b overflown-hidden">

					{/* Full Schedule */}
					{activeTab === 'schedules' && (
						<>
						{schedulesLoading ? (
							<LoadingSpinner/>
						): (
							<ScheduleTable>
							{schedules.map(schedule => (
								<>
								<SchedulesRow 
									key={schedule.event_date} 
									onSelected={handleScheduleSelect}
									onSessionSelected={handleSessionSelect}
									isSelected={schedule?.event_date == selectedSchedule?.event_date}
									schedule={schedule}/>
								</>
							))}
							</ScheduleTable>
						)}
						{schedulesLoadError && (
							<p>{schedulesLoadError}</p>
						)}
						</>
					)}

					{/* Upgrades */}

					{activeTab === 'upgrades' && (
						<>
						{upgradesLoading ? (
							<div className="flex justify-center py-5"><LoadingSpinner size={40} /></div>
						) : (
						<div>
							<UpgradesTable>
								{upgradesSummaries && Object.entries(upgradesSummaries).map(([team, summary]) => (
									<UpgradesRow key={team} team={team} summary={summary}/>
								))}
							</UpgradesTable>	
							{upgradesSummaries && Object.entries(upgradesSummaries).length > 0 && (
									<p className="text-gruv-bg2 dark:text-gruv-fg4 text-center py-2">Summaries are AI generated using GROQ</p>
								)}

							{upgradesLoadError && (
								<p className="text-gruv-fg2">Couldn't found upgrades for this GP</p>
							)}
						</div>
						)}
						</>
					)}

					{/* Leaderboard */}
					{activeTab === 'results' && (
						<ResultsPanel 
							data={results} 
							loading={resultsLoading} 
							raceLaps={leaderLaps}
							onDriverSelect={handleDriverSelect}
						/>
					)}

					{/* Laps */}
					{activeTab === 'laps' && (
						<>
						{lapsLoading ? (
							<>
							<ChartSkeleton />
							<TableSkeleton cols={6} rows={10}/>
							</>
						) : (
						<div className="flex flex-col items-center">
							{selectedDriver && (
							<div className="w-full text-center flex flex-col py-2 gap-2">
							<h2 className="text-gruv-fg2 text-xl font-bold">{selectedDriver} - Laps</h2>
							<div className="bg-gruv-fg2 h-0.5"/>
							</div>
						)}
							<LapChart laps={laps}/>
							<LapsTable>
								{laps.map((lap, index) => (
									<LapsRow key={index} lap={lap}/>
								))}
							</LapsTable>	
							{lapsLoadError && (
								<p className="text-gruv-red">{lapsLoadError}</p>
							)}
						</div>
						)}
						</>					)
					}

				</div>
				</div>
		</div>
	</ScreenLayout>
    </>
  )
}

export default App
