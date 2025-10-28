"use client";
import React from "react";
import Navigation from "./_components/Navigation";
import Sidebar from "./_components/Sidebar";
import { useSelectionStore } from "@/stores/selectionStore";

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const selectedId = useSelectionStore((state) => state.selectedId);

	return (
		<div className="bg-background-section">
			<div className="container-default py-6">
				{/* Header */}
				<Navigation />

				{/* Body */}
				<main className="flex flex-1 mt-7 gap-6 h-[calc(100vh-72px)]">
					{/* Left sidebar - ẩn trên mobile khi đã chọn item */}
					<div className={`${selectedId ? "hidden md:block" : "block"}`}>
						<Sidebar />
					</div>

					{/* Right content - chỉ hiện trên mobile khi đã chọn item, luôn hiện từ md trở lên */}
					<section
						className={`${selectedId ? "block" : "hidden md:block"} flex-1 bg-white p-4 md:p-6`}
					>
						{children}
					</section>
				</main>
			</div>
		</div>
	);
}
