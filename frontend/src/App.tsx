import { Suspense, useMemo } from "react"
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
import parseSessionNameToShort from "./utils/session_parser"
import {ResultsPanel} from "./components/results/ResultsPanel"
import {useLaps} from "./hooks/useLaps"
import LapsTable from "./components/laps/LapsTable"
import LapsRow from "./components/laps/LapsRow"
import {LapChart} from "./components/laps/LapChart"
import TableSkeleton from "./components/skeletons/TableSkeleton"
import ChartSkeleton from "./components/skeletons/ChartSkeleton"

function useIsDesktop() {
	const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768) 
	useEffect(() => {
		const handleResize = () => setIsDesktop(window.innerWidth >= 768)
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])
	return isDesktop
}

function App() {
	const isDesktop = useIsDesktop()
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
		setSelectedSession(null)
		setSelectedSession(null)
		setSelectedSchedule(schedule)
		setActiveTab('schedules')
	}

	const handleSessionSelect = (session: SessionSchedule) => {
		setSelectedSession(session)
		setSelectedDriver(null)
		setAppliedSessionType(parseSessionNameToShort(session?.name) as SessionType)
		setActiveTab('results')
	}

	const handleSetCurrentSchedule = () => {
		handleScheduleSelect(currentSchedule)
	}

	const handleYearSelected = (year: number) => {
		setAppliedYear(year)
		setSelectedSession(null)
		setSelectedDriver(null)
		setAppliedSessionType(null)
		setActiveTab('schedules')
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
				<>
				<button
					onClick={handleSetCurrentSchedule}
					className="hidden sm:block absolute right-5 top-2 py-1 px-2 rounded bg-gruv-fg2 dark:text-gruv-fg1 dark:bg-gruv-bg2 hover:bg-gruv-orange cursor-pointer">
					<p>Next GP</p>
				</button>
				
				</>
			)}
			
		</div>

		


		{/* Information about selected schedule */}
		<div className="mx-5 py-2">
			{!isViewingCurrentSchedule && (
				<button
					onClick={handleSetCurrentSchedule}
					className="sm:hidden w-full my-2 py-3 bg-gruv-fg2 dark:bg-gruv-bg1 rounded border border-dashed border-gruv-orange text-gruv-bg0 dark:text-gruv-fg2 hover:bg-gruv-orange hover:text-gruv-fg2 cursor-pointer font-mono">
					<p>Set current/next GP</p>
				</button>
			)}

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

			<div>
			<div className="flex flex-col md:flex-row w-full bg-gruv-fg2 dark:bg-gruv-bg1 p-2 gap-3 md:items-stretch">
			<div 
				className="w-full flex flex-col"
				style={ isDesktop ? { width: activeTab === 'schedules' ? '100%' : '40%' } : undefined}
			>
				<div className="flex flex-row w-full text-center dark:text-gruv-fg2 font-mono justify-center py-2">
					<select 
						className={`px-2`}
						value={appliedYear} 
						onChange={(e) => handleYearSelected(Number(e.target.value))}
					>
						{yearOptions.map(y => (
							<option key={y} value={y} className="bg-gruv-fg2 dark:bg-gruv-bg1">{y}</option>
						))}
					</select>
				</div>
			<div className={`w-full h-full overflow-y-auto min-h-[300px] max-h-[300px] md:max-h-[1000px]
				transition-[width] duration-500 ease-in-out`}
				>

					{/* Full Schedule */}
					<Suspense fallback={<LoadingSpinner/>}>
						<>
						<ScheduleTable>
						{schedules.map(schedule => (
							<>
							<SchedulesRow 
								key={schedule.event_date} 
								onSelected={handleScheduleSelect}
								onSessionSelected={handleSessionSelect}
								isSelected={schedule?.event_date == selectedSchedule?.event_date}
								selectedSession={selectedSession}
								schedule={schedule}/>
							</>
						))}
						</ScheduleTable>
						</>
						{schedulesLoadError && (
						<p>{schedulesLoadError}</p>
					)}

					</Suspense>
				</div>
			</div>
				<div className="px-2 transition-[width] duration-300 ease-in-out" 
					style={ isDesktop ? { width: activeTab !== 'schedules' ? '80%' : '0%' } : undefined}
				>

					{/* Tab navigation section*/}
					<div className={`flex-row 
						${activeTab === 'schedules' ? 'hidden' : 'block'}
					`}>
						<button 
							onClick={() => setActiveTab('upgrades')}
							className={`p-2 rounded-t text-lg cursor-pointer text-gruv-bg2 dark:text-gruv-fg2 font-mono disabled:text-gruv-gray disabled:cursor-not-allowed
								${activeTab === 'upgrades' ? 'bg-gruv-fg1 dark:bg-gruv-bg2' : 'bg-transparent'}
							`}
							disabled = {!upgradesSummaries || Object.entries(upgradesSummaries).length <= 0 }
							>
						Upgrades
						</button>
						<button 
							onClick={() => setActiveTab('results')}
							className={`p-2 rounded-t text-lg cursor-pointer text-gruv-bg2 dark:text-gruv-fg2 font-mono disabled:text-gruv-gray disabled:cursor-not-allowed
								${activeTab === 'results' ? 'bg-gruv-fg1 dark:bg-gruv-bg2' : 'bg-transparent'}
							`}
							disabled = {!results}
							>
							Results
						</button>
					</div>

					<div className="w-full bg-gruv-fg1 dark:bg-gruv-bg2 border border-gruv-fg3 dark:border-gruv-bg3 rounded overflow-hidden">

					{/* Upgrades tab */}
					{activeTab === 'upgrades' && (
						<Suspense fallback={
							<div className="flex justify-center py-5"><LoadingSpinner size={40} /></div>
						}>
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

						</Suspense>
					)}

					{/* Results tab */}
					{activeTab === "results" &&
						<div className="w-full text-center flex flex-col justify-center py-2 gap-2 overflow-y-auto max-h-[1000px]">
						<Suspense fallback={<TableSkeleton rows={20} cols={3} />}>
							<ResultsPanel 
								data={results} 
								loading={resultsLoading} 
								raceLaps={leaderLaps}
								onDriverSelect={handleDriverSelect}
							/>
							{resultsLoadError && (<p className="text-red-500">{resultsLoadError}</p>)}
						</Suspense>
						</div>
					}

					{/* Laps tab */}
					{activeTab === 'laps' &&
						<div className="overflow-y-auto max-h-[1000px]">	
							<div className="relative w-full text-center flex flex-row justify-center py-2 gap-2">
							<button 
								onClick={() => setActiveTab('results')}
								className="absolute left-0 px-2 cursor-pointer text-gruv-bg4 dark:text-gruv-fg2 font-mono"
							>
								{'<'} Back
							</button>
								<h2 className="text-gruv-bg2 dark:text-gruv-fg2 text-xl font-bold">{selectedDriver} - Laps</h2>
							<div className="bg-gruv-fg2 h-0.5"/>
							</div>
							<Suspense fallback={
								<>
								<ChartSkeleton />
								<TableSkeleton rows={5} cols={5} />
								</>

							}>
								<>
								<LapChart laps={laps}/>
								<LapsTable>
									{laps.map((lap, index) => (
										<LapsRow key={index} lap={lap}/>
									))}
								</LapsTable>	
								{lapsLoadError && (
									<p className="text-gruv-red">{lapsLoadError}</p>
								)}
								</>
							</Suspense>
							</div>
					}
					</div>
				</div>
				</div>
			</div>
		</div>
	</ScreenLayout>
    </>
  )
}

export default App
