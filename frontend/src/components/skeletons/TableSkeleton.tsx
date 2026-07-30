import React from "react"

export default function TableSkeleton({ rows = 4, cols = 4 }) {
	return (
		<div className={`animate-pulse overflown-hidden`}>
			<div className="flex flex-col gap-3">
				
				{/* Table Header Skeleton */}
				<div 
					className="grid gap-4 bg-gruv-orange/60 h-14 p-4 items-center"
					style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
				>
					{Array.from({ length: cols }).map((_, cIdx) => (
						<div 
							key={cIdx} 
							className="h-4 bg-gruv-bg3 dark:bg-gruv-fg3 rounded"
							style={{ width: cIdx % 2 === 0 ? '60%' : '40%' }}
						/>
					))}
				</div>

				{/* Table Body Rows Skeleton */}
				{Array.from({ length: rows }).map((_, rIdx) => (
					<div 
						key={rIdx}
						className="grid gap-4 h-12 px-4 items-center border-b border-gruv-bg3 dark:border-gruv-fg2 dark:border-neutral-600"
						style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
					>
						{Array.from({ length: cols }).map((_, cIdx) => (
							<div 
								key={cIdx} 
								className={`h-4 bg-gruv-bg3 dark:bg-gruv-fg2 rounded`}
								style={{ width: `${60 + (cIdx * 7) % 35}%` }} 
							/>
						))}
					</div>
				))}

				</div>
		</div>
	)
}
