export function formatDuration(seconds: number | null): string {
	if (seconds === null) return "—"
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = seconds % 60
	return `${minutes}:${remainingSeconds.toFixed(3).padStart(6, "0")}`
}

export function formatSessionTime(seconds: number | null): string {
	if (seconds === null) return "—"
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const remainingSeconds = Math.floor(seconds % 60)
	return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}
