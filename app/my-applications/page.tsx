"use client";
import React, { useState } from "react";
import { ChevronLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useSelectionStore } from "@/stores/selectionStore";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

type ApplicationType = "all" | "securities" | "alternatives";

interface Application {
	id: number;
	productName: string;
	code: string;
	issuePrice: string;
	applied: number;
	allocated: number;
	closingDate: string;
	type: "securities" | "alternatives";
}

export default function MyApplication() {
	const router = useRouter();
	const { setSelectedId } = useSelectionStore();
	const [activeTab, setActiveTab] = useState<ApplicationType>("all");

	const applications: Application[] = [
		{
			id: 1,
			productName: "CGS SG 3-month USD Commercial Paper Series 012",
			code: "C012USD.ADDX",
			issuePrice: "20,000.00 USD",
			applied: 1000,
			allocated: 0,
			closingDate: "02-Nov-2025, 17:00 SGT",
			type: "securities",
		},
		{
			id: 2,
			productName: "CGS SG 3-month USD Commercial Paper Series 018",
			code: "C012USD.AAXD",
			issuePrice: "20,000.00 USD",
			applied: 1000,
			allocated: 0,
			closingDate: "02-Nov-2025, 17:00 SGT",
			type: "securities",
		},
	];

	const filteredApplications =
		activeTab === "all" ? applications : applications.filter((app) => app.type === activeTab);

	const handleViewClick = (application: Application) => {
		setSelectedId(application.id);
		router.push(`/${application.type}`);
	};

	return (
		<div className="bg-background-section">
			<div className="container-default py-6">
				{/* Header */}
				<div className="flex items-center gap-2 mb-6">
					<Button variant="ghost" size="icon" onClick={() => router.back()}>
						<ChevronLeft className="h-6 w-6" />
					</Button>
					<h1 className="text-xl font-semibold text-typo-primary">My Applications</h1>
				</div>

				{/* Content Box */}
				<div className="bg-white p-4 md:p-6 rounded-lg min-h-[856px] flex flex-col">
					{/* Tabs */}
					<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ApplicationType)}>
						<TabsList className="mb-6 bg-transparent gap-2">
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="securities">Securities</TabsTrigger>
							<TabsTrigger value="alternatives">Alternatives</TabsTrigger>
						</TabsList>
					</Tabs>

					{/* Table or Empty State */}
					{filteredApplications.length === 0 ? (
						<div className="flex-1 flex flex-col items-center justify-center text-center text-typo-secondary gap-4 text-xs font-normal">
							<p>No product applications available.</p>
							<p>Check back here after you’ve submitted your application.</p>
						</div>
					) : (
						<>
							{/* Bọc bảng trong container có overflow-x-auto để cuộn ngang khi màn hình nhỏ */}
							<div className="overflow-x-auto">
								<Table className="rounded-t-4xl table-fixed min-w-max">
									<TableHeader className="bg-theme-neutral-095">
										<TableRow className="*:font-semibold py-3">
											<TableHead className="px-3 w-[25%] min-w-[200px]">
												Product Name
											</TableHead>
											<TableHead className="px-3 w-[13%] min-w-[100px]">Code</TableHead>
											<TableHead className="px-3 w-[15%] min-w-[120px]">
												Issue Price
											</TableHead>
											<TableHead className="px-3 w-[11%] min-w-[80px]">
												Applied
											</TableHead>
											<TableHead className="px-3 w-[12%] min-w-[80px]">
												Allocated
											</TableHead>
											<TableHead className="px-3 w-[11%] min-w-[140px]">
												Closing Date
											</TableHead>
											<TableHead className="px-3 w-[13%] min-w-[160px]">
												Application Note
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredApplications.map((app) => (
											<TableRow key={app.id} className="*:whitespace-normal">
												<TableCell className="font-medium text-enhanced-blue py-4 px-3">
													{app.productName}
												</TableCell>
												<TableCell className="px-3">{app.code}</TableCell>
												<TableCell className="px-3">{app.issuePrice}</TableCell>
												<TableCell className="px-3">{app.applied}</TableCell>
												<TableCell className="px-3">{app.allocated}</TableCell>
												<TableCell className="px-3">{app.closingDate}</TableCell>
												<TableCell className="px-3 text-center">
													<Button
														size="sm"
														className="bg-enhanced-blue rounded-sm font-normal hover:bg-enhanced-blue/90 text-white px-3"
														onClick={() => handleViewClick(app)}
													>
														<FileText />
														View
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							{/* Pagination */}
							<div className="flex items-center justify-center gap-2 py-4 mt-auto">
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious href="#" />
										</PaginationItem>
										<PaginationItem>
											<PaginationLink
												href="#"
												isActive
												className="bg-enhanced-blue text-white hover:bg-enhanced-blue/90 hover:text-white"
											>
												1
											</PaginationLink>
										</PaginationItem>
										<PaginationItem>
											<PaginationNext href="#" />
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
