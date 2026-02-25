"use client";
import { useEffect } from "react";
import Navigation from "./_components/Navigation";
import Sidebar from "./_components/Sidebar";
import { useSelectionStore } from "@/stores/selectionStore";
import { ChevronLeft } from "lucide-react";

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const { selectedId, clearSelection } = useSelectionStore();

	useEffect(() => {
		return () => clearSelection();
	}, [clearSelection]);

	const handleBackToSidebar = () => {
		clearSelection();
	};

	return (
		<div className="bg-background-section">
			<div className="container-default py-6">
				{/* Header */}
				<Navigation />

				{/* Body */}
				<main className="flex flex-1 mt-7 gap-6 h-[calc(100vh-172px)]">
					{/* Left sidebar - ẩn trên mobile khi đã chọn item */}
					<div className={`${selectedId ? "hidden md:block" : "block"}`}>
						<Sidebar />
					</div>

					{/* Right content - chỉ hiện trên mobile khi đã chọn item, luôn hiện từ md trở lên */}
					<section
						className={`${selectedId ? "block" : "hidden md:block"} flex-1 h-full bg-white pad rounded`}
					>
						<div className="flex-shrink-0">
							<ChevronLeft
								className="inline-block cursor-pointer md:hidden hover:text-cgs-blue transition-colors mb-1.5"
								onClick={handleBackToSidebar}
							/>
						</div>
						{children}
					</section>
				</main>
			</div>
		</div>
	);
}
