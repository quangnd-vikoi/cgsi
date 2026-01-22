"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { useSelectionStore } from "@/stores/selectionStore";
import { cn } from "@/lib/utils";
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
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type ApplicationType = "all" | "securities" | "alternatives";

interface Application {
	subscriptionId: string;
	productName: string;
	productCode: string;
	stockCode: string;
	issuePrice: string;
	applied: number;
	allocated: number;
	closingDate: string;
	type: "securities" | "alternatives";
}

export default function MyApplication() {
	const router = useRouter();
	const setSelectedItem = useSelectionStore((state) => state.setSelectedItem);
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
				response.data.userProductSubs.map((sub) => {
					// Normalize product type - match exactly or default based on known alternatives
					const normalizedType = sub.productType?.toLowerCase().trim();
					let type: "securities" | "alternatives";

					if (
						normalizedType === "securities" ||
						normalizedType === "security" ||
						normalizedType === "iop"
					) {
						type = "securities";
					} else if (
						normalizedType === "alternatives" ||
						normalizedType === "alternative" ||
						normalizedType === "structured products" ||
						normalizedType === "funds" ||
						normalizedType === "bonds" ||
						normalizedType === "ai"
					) {
						type = "alternatives";
					} else {
						// Default to securities for unknown types
						console.warn(`Unknown product type: ${sub.productType}, defaulting to securities`);
						type = "securities";
					}

					return {
						subscriptionId: sub.subscriptionId,
						productName: sub.productName,
						productCode: sub.productCode,
						stockCode: sub.stockCode,
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
						type,
					};
				});

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

	const handleProductNameClick = (application: Application) => {
		// Set the selected item in the store
		setSelectedItem({
			id: application.productCode, // Use productCode as param
			name: application.productName,
			code: application.stockCode,
			issuePrice: application.issuePrice,
			closingDate: application.closingDate,
			hasDetails: true,
			applied: true,
		});

		// Navigate to securities or alternatives page based on type
		const route = application.type === "securities"
			? INTERNAL_ROUTES.SECURITIES
			: INTERNAL_ROUTES.ALTERNATIVE;
		router.push(route);
	};

	return (
		<div className="flex-1 flex flex-col h-full">
			{/* Header */}
			<Title showBackButton title="Applications History" />
			{/* Content Box */}
			<div className="bg-white pad rounded flex-1 flex flex-col overflow-hidden min-h-0">
				{/* Tabs */}
				<Tabs
					value={activeTab}
					onValueChange={(v) => setActiveTab(v as ApplicationType)}
				>
					<TabsList className="mb-6 bg-transparent !gap-2 border-b-0">
						<TabsTrigger
							value="all"
							className="px-4 py-1.5 border border-stroke-secondary rounded-full data-[state=active]:bg-background-selected data-[state=active]:text-cgs-blue data-[state=active]:border-cgs-blue hover:bg-transparent hover:border-cgs-blue"
						>
							All
						</TabsTrigger>
						<TabsTrigger
							value="securities"
							className="px-4 py-1.5 border border-stroke-secondary rounded-full data-[state=active]:bg-background-selected data-[state=active]:text-cgs-blue data-[state=active]:border-cgs-blue hover:bg-transparent hover:border-cgs-blue"
						>
							Securities
						</TabsTrigger>
						<TabsTrigger
							value="alternatives"
							className="px-4 py-1.5 border border-stroke-secondary rounded-full data-[state=active]:bg-background-selected data-[state=active]:text-cgs-blue data-[state=active]:border-cgs-blue hover:bg-transparent hover:border-cgs-blue"
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
								<Skeleton key={i} className="h-12 w-full" />
							))}
						</div>
					</div>
				) : error ? (
					/* Error State */
					<div className="flex-1 w-full flex items-center justify-center">
						<ErrorState
							type="error"
							title="Unable to Load Applications"
							description="We are unable to display your applications at this time. Please try again later."
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
						{/* Mobile Card View */}
						<div className="md:hidden space-y-4">
							{filteredApplications.map((app) => (
								<div
									key={app.subscriptionId}
									className="border border-stroke-secondary rounded-lg p-4"
								>
									{/* Header: Product Name + Details Button */}
									<div className="flex items-start justify-between gap-2 mb-3">
										<div className="flex-1 min-w-0">
											<h3 className="font-medium text-typo-primary line-clamp-2">
												{app.productName}
											</h3>
											<Badge variant="outline" className="mt-1 text-xs font-normal rounded-full">
												{app.stockCode}
											</Badge>
										</div>
										<Button
											variant="outline"
											size="sm"
											className="shrink-0 rounded-full text-cgs-blue border-cgs-blue hover:bg-cgs-blue/5"
											onClick={() => handleProductNameClick(app)}
										>
											Details
											<ArrowRight className="w-4 h-4" />
										</Button>
									</div>

									{/* Info Grid */}
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-typo-secondary">Issue Price</span>
											<span className="font-medium text-typo-primary">{app.issuePrice}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-typo-secondary">Applied</span>
											<span className="text-typo-primary">{app.applied.toLocaleString()}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-typo-secondary">Allocated</span>
											<span className="text-typo-primary">{app.allocated > 0 ? app.allocated.toLocaleString() : "-"}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-typo-secondary">Closing Date</span>
											<span className="text-typo-primary">{app.closingDate}</span>
										</div>
									</div>

									{/* View Application Note Button */}
									<Button
										className="w-full mt-4 bg-cgs-blue hover:bg-cgs-blue/90 text-white"
										onClick={() => handleViewClick(app)}
									>
										<FileText className="w-4 h-4 mr-2" />
										View Application Note
									</Button>
								</div>
							))}
						</div>

						{/* Desktop Table View */}
						<div className="hidden md:block overflow-x-auto">
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
											<TableCell className="py-4 px-3">
												<button
													onClick={() => handleProductNameClick(app)}
													className={cn(
														"font-medium text-cgs-blue cursor-pointer",
														"hover:underline text-left"
													)}
												>
													{app.productName}
												</button>
											</TableCell>
											<TableCell className="px-3">{app.stockCode}</TableCell>
											<TableCell className="px-3">{app.issuePrice}</TableCell>
											<TableCell className="px-3">{app.applied.toLocaleString()}</TableCell>
											<TableCell className="px-3">{app.allocated > 0 ? app.allocated.toLocaleString() : "-"}</TableCell>
											<TableCell className="px-3">{app.closingDate}</TableCell>
											<TableCell className="px-3 text-center">
												<Button
													size="sm"
													className="bg-cgs-blue rounded-sm font-normal hover:bg-cgs-blue/90 text-white px-3"
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
											className="bg-cgs-blue text-white hover:bg-cgs-blue/90 hover:text-white"
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
