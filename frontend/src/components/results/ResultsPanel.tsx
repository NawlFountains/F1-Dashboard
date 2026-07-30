import { LoadingSpinner } from '../styles/Icons'
import PracticeResultsRow from './practice/PracticeResultsRow'
import PracticeResultsTable from './practice/PracticeResultsTable'
import QualifyingResultsRow from './qualifying/QualifyingResultsRow'
import QualifyingResultsTable from './qualifying/QualifyingResultsTable'
import RaceResultsRow from './race/RaceResultsRow'
import RaceResultsTable from './race/RaceResultsTable'
import type {SessionResultsData} from '../../types'

interface ResultsPanelProps {
	onDriverSelect: (driver: string) => void
	data: SessionResultsData | null;
	loading: boolean; 
	raceLaps: number 
}

export function ResultsPanel({ data, loading, raceLaps, onDriverSelect }: ResultsPanelProps) {
	if (loading) return <div className="flex justify-center py-5"><LoadingSpinner size={40} /></div>
	if (!data) return null

	switch (data.kind) {
		case "race":
			return (
				<RaceResultsTable>
					{data.results.map((result, index) => (
						<RaceResultsRow key={index} result={result} raceLaps={raceLaps} onSelect={onDriverSelect}/>
					))}
				</RaceResultsTable>
			)
		case "qualifying":
			return (
				<QualifyingResultsTable>
					{data.results.map((result, index) => (
						<QualifyingResultsRow key={index} result={result} onSelect={onDriverSelect}/>
					))}
				</QualifyingResultsTable>
			)
		case "practice":
			return (
				<PracticeResultsTable>
					{data.results.map((result, index) => (
						<PracticeResultsRow key={index} result={result} onSelect={onDriverSelect}/>
					))}
				</PracticeResultsTable>
			)
	}
}
