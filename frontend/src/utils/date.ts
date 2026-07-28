export function formatDate(timestamp: string) {
	return new Date(timestamp).toLocaleDateString()
}

export function formatDateTime(timestamp: string) {
	return new Date(timestamp).toLocaleString()
}

export function formatEventDateSpan(startDateTimestamp: string, endDateTimestamp: string): string {
	const startDateMonth = new Date(startDateTimestamp).toLocaleDateString(undefined, {
		month: 'short'
	})
	const endDateMonth = new Date(endDateTimestamp).toLocaleDateString(undefined, {
		month: 'short'
	})
	const startDateDay = new Date(startDateTimestamp).toLocaleDateString(undefined, {
		day: 'numeric'
	})
	const endDateDay = new Date(endDateTimestamp).toLocaleDateString(undefined, {
		day: 'numeric'
	})

	if (startDateMonth === endDateMonth) {
		return `${startDateDay} - ${endDateDay} ${endDateMonth}`
	}
	return `${startDateDay} ${startDateMonth} - ${endDateDay} ${endDateMonth}`

}
