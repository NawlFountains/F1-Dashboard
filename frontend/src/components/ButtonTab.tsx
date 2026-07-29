import type {ReactNode} from "react"

interface ButtonTabProps {
	onSelect: () => void,
	isSelected: boolean
	name: string,
	children?: ReactNode
}

export default function ButtonTab({ onSelect, isSelected, name, children } : ButtonTabProps) {
	return (
		<button
			onClick={onSelect}
			className={`flex flex-row rounded-t px-2 py-1 dark:text-gruv-fg2
				${isSelected ? 'bg-gruv-fg2 dark:bg-gruv-bg1' : 'bg-gruv-fg3 dark:bg-gruv-bg0 shadow-md shadow-neutral-900'}`}
		>
			<h1>{name}</h1>
			{children}
		</button>
	)
}
