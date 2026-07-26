import type { ReactNode } from "react";
import Footer from '../components/Footer'

export default function ScreenLayout( { children }: {children : ReactNode} ) {
	return (
		<div className="min-h-screen w-full flex flex-col bg-gruv-fg0 dark:bg-gruv-bg0 items-center">
		{children}
		<Footer/>
		</div>
	)
}
