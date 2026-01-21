import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { SheetManager } from "@/app/(minimal)/sidebar/SheetManager";
import { NotificationPolling } from "@/components/NotificationPolling";
import { DataInitializer } from "@/components/DataInitializer";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex flex-col min-h-screen">
			<NotificationPolling />
			<DataInitializer />

			<header className="bg-white z-10">
				<Header />
				<SheetManager />
			</header>

			<main className="flex-1 flex flex-col min-h-0">{children}</main>

			<footer>
				<Footer />
			</footer>

			<Toaster position="bottom-right" />
		</div>
	);
}
