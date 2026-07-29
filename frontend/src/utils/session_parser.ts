export default function parseSessionNameToShort(session_name: string): string {
	switch (session_name) {
		case "Practice 1":
			return "FP1"
		case "Practice 2":
			return "FP2"
		case "Practice 3":
			return "FP3"
		case "Sprint Shootout":
			return "SS"
		case "Sprint":
			return "S"
		case "Sprint Qualifying":
			return "SQ"
		case "Qualifying":
			return "Q"
		default:
			return "R"
	}
}
