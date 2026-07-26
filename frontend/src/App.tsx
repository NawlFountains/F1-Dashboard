import ScreenLayout from "./layouts/ScreenLayout"

function App() {

  return (
    <>
    	<ScreenLayout>
		<div className='relative w-full bg-gruv-fg1 dark:bg-gruv-bg1 text-center py-2'>
			<div
				className="absolute top-2 right-4 flex flex-row 
				border border-[--pattern-fg]">
			<input
				placeholder="Search CTRL + K"
				className="px-2 rounded"
			/>
			</div>
			<h1 className="text-2xl text-bold font-mono">
				F1 - Dashboard
			</h1>
			
		</div>
		<div className="grid grid-cols-5 w-full px-5 gap-5">
			<div className="col-span-4 w-full h-200 bg-gruv-fg2 flex flex-col">
			Current race
			</div>
			<div className="flex flex-col bg-gruv-fg2">
			Leaderboard
			</div>
		</div>
	</ScreenLayout>
    </>
  )
}

export default App
