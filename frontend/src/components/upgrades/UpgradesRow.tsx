import type { TeamSummary } from "../../types"

interface UpgradesRowProps {
    teamName: string
    teamSummary: TeamSummary
}

export default function UpgradesRow({ teamName, teamSummary }: UpgradesRowProps) {
    const { has_updates, summary } = teamSummary
    const hasText = has_updates && !!summary

    return (
        <tr>
            <td className="font-mono bg-gruv-orange px-2 text-gruv-fg2 font-bold">
                {teamName}
            </td>
            <td className={`text-sm p-2 dark:text-gruv-fg2 ${hasText ? "" : "italic opacity-60"}`}>
                {hasText ? summary : "No updates for this event"}
            </td>
        </tr>
    )
}