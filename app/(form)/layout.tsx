// app/alternatives/layout.tsx

import Navigation from "./Navigation";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-background-section">
			<div className="container-default py-6 ">
				{/* Header */}
				<Navigation />
				{/* Body */}
				<main className="flex flex-1 mt-7 gap-6 h-[calc(100vh-72px)]">
					{/* Left sidebar */}
					<Sidebar />

					{/* Right content */}
					<section className="hidden md:block flex-1 bg-white p-6">{children}</section>
				</main>
			</div>
		</div>
	);
}
