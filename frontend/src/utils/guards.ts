import type { SessionType, RaceSessionType, QualifyingSessionType, PracticeSessionType } from "../types"

export function isRaceSession(s: SessionType): s is RaceSessionType {
	return s === "R" || s === "S"
}
export function isQualifyingSession(s: SessionType): s is QualifyingSessionType {
	return s === "Q" || s === "SQ" || s === "SS"
}
export function isPracticeSession(s: SessionType): s is PracticeSessionType {
	return s === "FP1" || s === "FP2" || s === "FP3"
}
