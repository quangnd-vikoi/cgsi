"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { INTERNAL_ROUTES } from "@/constants/routes";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import Title from "@/components/Title";
import { subscriptionService } from "@/lib/services/subscriptionService";
import type { UserProductSubscriptionDto } from "@/types";
import { ErrorState } from "@/components/ErrorState";

type ApplicationType = "all" | "securities" | "alternatives";

interface Application {
	subscriptionId: string;
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
	const [activeTab, setActiveTab] = useState<ApplicationType>("all");
	const [applications, setApplications] = useState<Application[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch applications from API
	const fetchApplications = useCallback(async () => {
		setLoading(true);
		setError(null);

		const response = await subscriptionService.getUserProductSubscriptions();

		if (response.success && response.data) {
			// Map API data to Application structure
			const mappedApplications: Application[] =
				response.data.userProductSubs.map((sub) => ({
					subscriptionId: sub.subscriptionId,
					productName: sub.productName,
					code: sub.stockCode,
					issuePrice: `${sub.issuePrice.toFixed(2)} ${sub.currency}`,
					applied: sub.appliedQty || 0,
					allocated: sub.allocatedQty || 0,
					closingDate: sub.endTime
						? new Date(sub.endTime).toLocaleString("en-GB", {
								day: "2-digit",
								month: "short",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit",
								timeZoneName: "short",
						  })
						: "N/A",
					type:
						sub.productType?.toLowerCase() === "securities"
							? "securities"
							: "alternatives",
				}));

			setApplications(mappedApplications);
		} else {
			setError(response.error || "Failed to load applications");
		}

		setLoading(false);
	}, []);

	// Fetch data on mount
	useEffect(() => {
		fetchApplications();
	}, [fetchApplications]);

	const filteredApplications =
		activeTab === "all"
			? applications
			: applications.filter((app) => app.type === activeTab);

	const handleViewClick = (application: Application) => {
		router.push(`${INTERNAL_ROUTES.APPLICATION_NOTE}?subscriptionId=${application.subscriptionId}`);
	};

	return (
		<div className="flex-1 flex flex-col">
			{/* Header */}
			<Title showBackButton title="My Applications" />
			{/* Content Box */}
			<div className="bg-white pad rounded-lg flex-1 flex flex-col">
				{/* Tabs */}
				<Tabs
					value={activeTab}
					onValueChange={(v) => setActiveTab(v as ApplicationType)}
				>
					<TabsList className="mb-6 bg-transparent gap-2 border-b-0">
						<TabsTrigger
							value="all"
							className="px-4 py-1.5 border border-stroke-secondary rounded-full data-[state=active]:bg-background-selected data-[state=active]:text-enhanced-blue data-[state=active]:border-enhanced-blue hover:bg-transparent hover:border-enhanced-blue"
						>
							All
						</TabsTrigger>
						<TabsTrigger
							value="securities"
							className="px-4 py-1.5 border border-stroke-secondary rounded-full data-[state=active]:bg-background-selected data-[state=active]:text-enhanced-blue data-[state=active]:border-enhanced-blue hover:bg-transparent hover:border-enhanced-blue"
						>
							Securities
						</TabsTrigger>
						<TabsTrigger
							value="alternatives"
							className="px-4 py-1.5 border border-stroke-secondary rounded-full data-[state=active]:bg-background-selected data-[state=active]:text-enhanced-blue data-[state=active]:border-enhanced-blue hover:bg-transparent hover:border-enhanced-blue"
						>
							Alternatives
						</TabsTrigger>
					</TabsList>
				</Tabs>

				{/* Loading State */}
				{loading ? (
					<div className="flex-1 w-full flex items-center justify-center">
						<div className="space-y-4 w-full">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="animate-pulse flex gap-4">
									<div className="h-12 bg-gray-200 rounded flex-1"></div>
								</div>
							))}
						</div>
					</div>
				) : error ? (
					/* Error State */
					<div className="flex-1 w-full flex items-center justify-center">
						<ErrorState
							type="error"
							description={error}
						/>
					</div>
				) : filteredApplications.length === 0 ? (
					/* Empty State */
					<div className="flex-1 w-full flex items-center justify-center">
						<ErrorState
							type="empty"
							title="No product applications available."
							description="Check back here after you've submitted your application."
						/>
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
										<TableHead className="px-3 w-[11%] min-w-[80px]">Applied</TableHead>
										<TableHead className="px-3 w-[12%] min-w-[80px]">Allocated</TableHead>
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
										<TableRow key={app.subscriptionId} className="*:whitespace-normal">
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
	);
}
