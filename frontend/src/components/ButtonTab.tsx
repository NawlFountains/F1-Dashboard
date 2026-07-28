interface ButtonTabProps {
	onSelect: () => void,
	isSelected: boolean
	name: string,
}

export default function ButtonTab({ onSelect, isSelected, name } : ButtonTabProps) {
	return (
		<button
			onClick={onSelect}
			className={`rounded-t px-2 py-1 dark:text-gruv-fg2
				${isSelected ? 'bg-gruv-fg2 dark:bg-gruv-bg1' : 'bg-gruv-fg3 dark:bg-gruv-bg0 shadow-md shadow-neutral-900'}`}
		>
			{name}
		</button>
	)
}
