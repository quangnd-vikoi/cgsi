"use client";
import React, { useState } from "react";
import Navigation from "./_components/Navigation";
import Sidebar from "./_components/Sidebar";
import { useSelectionStore } from "@/stores/selectionStore";
import { ChevronLeft, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const { selectedId, clearSelection } = useSelectionStore();

	const handleBackToSidebar = () => {
		clearSelection();
	};

	return (
		<div className="bg-background-section">
			<div className="container-default py-6">
				{/* Header */}
				<Navigation />

				{/* Body */}
				<main className="flex flex-1 mt-7 gap-6 h-[calc(100vh-232px)]">
					{/* Left sidebar - ẩn trên mobile khi đã chọn item */}
					<div className={`${selectedId ? "hidden md:block" : "block"}`}>
						<Sidebar />
					</div>

					{/* Right content - chỉ hiện trên mobile khi đã chọn item, luôn hiện từ md trở lên */}
					<section
						className={`${
							selectedId ? "block" : "hidden md:block"
						} flex-1 h-full bg-white p-4 md:p-6`}
					>
						<div className="flex-shrink-0">
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-2">
									<ChevronLeft
										className="inline-block cursor-pointer md:hidden hover:text-enhanced-blue transition-colors"
										onClick={handleBackToSidebar}
									/>
									<p className="text-base font-semibold">Details</p>
								</div>
								<X
									className="cursor-pointer hover:text-enhanced-blue transition-colors"
									onClick={handleBackToSidebar}
								/>
							</div>

							<Separator className="my-4" />
						</div>
						{children}
					</section>
				</main>
			</div>
		</div>
	);
}
