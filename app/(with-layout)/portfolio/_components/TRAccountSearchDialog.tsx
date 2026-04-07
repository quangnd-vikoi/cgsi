"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import type { TradingAccount, PortfolioType } from "@/types";
import { searchAccounts, type AccountSearchItem } from "@/lib/services/profileService";

const SEARCH_TABS = [
	{ value: "account-no", label: "Account No.", placeholder: "Enter Account Number" },
	{ value: "client-name", label: "Client Name", placeholder: "Enter Client Name" },
	{ value: "nric", label: "NRIC", placeholder: "Enter NRIC" },
] as const;

const PER_PAGE = 10;

interface TRAccountSearchDialogProps {
	onSelectAccount: (account: TradingAccount) => void;
	selectedAccount: TradingAccount | null;
	isTRClientAccount: boolean;
	fullWidth?: boolean;
}

const getPageNumbers = (currentPage: number, totalPages: number): (number | "...")[] => {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	if (currentPage <= 4) {
		return [1, 2, 3, 4, 5, "...", totalPages];
	}

	if (currentPage >= totalPages - 3) {
		return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
	}

	return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};

const TRAccountSearchDialog = ({
	onSelectAccount,
	selectedAccount,
	isTRClientAccount,
	fullWidth,
}: TRAccountSearchDialogProps) => {
	const [open, setOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("account-no");
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [results, setResults] = useState<AccountSearchItem[]>([]);
	const [total, setTotal] = useState(0);
	const [hasSearched, setHasSearched] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const handleSearch = async (page = 1) => {
		if (!searchQuery.trim() || searchQuery.trim().length < 3) return;

		setIsSearching(true);
		setCurrentPage(page);

		const params =
			activeTab === "account-no" ? { searchAcct: searchQuery } :
				activeTab === "client-name" ? { searchName: searchQuery } :
					{ searchNric: searchQuery };

		const response = await searchAccounts({
			...params,
			pageSize: PER_PAGE,
			pageIndex: page - 1,
		});

		if (response.success && response.data) {
			setResults(response.data.data);
			setTotal(response.data.total);
		} else {
			setResults([]);
			setTotal(0);
		}
		setHasSearched(true);
		setIsSearching(false);
	};

	const handleSelectAccount = (item: AccountSearchItem) => {
		const account: TradingAccount = {
			accountNo: item.accountNo,
			accountType: item.accountSubType as PortfolioType,
		};
		onSelectAccount(account);
		setOpen(false);
		resetState();
	};

	const resetState = () => {
		setSearchQuery("");
		setResults([]);
		setTotal(0);
		setHasSearched(false);
		setCurrentPage(1);
	};

	const totalPages = Math.ceil(total / PER_PAGE);

	const isSearchDisabled = isSearching || searchQuery.trim().length < 3;

	return (
		<Dialog
			open={open}
			onOpenChange={(value) => {
				setOpen(value);
				if (!value) resetState();
			}}
		>
			<DialogTrigger asChild>
				<Button
					className={cn(
						"w-full bg-white border border-stroke-secondary rounded h-auto py-2 px-3 flex items-center justify-between text-left cursor-pointer hover:border-cgs-blue transition-colors hover:bg-background-section",
						!fullWidth && "md:max-w-[258px]",
					)}
				>
					<span className="text-sm text-typo-primary font-medium">
						{isTRClientAccount && selectedAccount
							? `${selectedAccount.accountType ? `(${selectedAccount.accountType})` : ""} ${selectedAccount.accountNo}`
							: "Search Client Account"}
					</span>
					<Search className="w-4 h-4 text-typo-tertiary shrink-0" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[480px] gap-0 max-h-[95vh] flex flex-col">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">Search Account</DialogTitle>
				</DialogHeader>

				<Tabs
					value={activeTab}
					onValueChange={(value) => {
						setActiveTab(value);
						resetState();
					}}
					className="mt-4 gap-0 flex flex-col overflow-hidden"
				>
					<TabsList className="gap-4 shrink-0">
						{SEARCH_TABS.map((tab) => (
							<TabsTrigger className="pb-2.5" key={tab.value} value={tab.value}>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>

					{SEARCH_TABS.map((tab) => (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className="flex flex-col overflow-hidden"
						>
							{/* Search input + button */}
							<div className="flex items-center gap-3 mt-4 md:mt-6 shrink-0">
								<div className="flex-1 border-b border-stroke-secondary">
									<input
										type="text"
										placeholder={tab.placeholder}
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") handleSearch();
										}}
										className="w-full py-2 text-sm text-typo-primary placeholder:text-typo-tertiary outline-none bg-transparent placeholder:font-normal"
									/>
								</div>
								<Button
									className="shrink-0 px-6"
									onClick={() => handleSearch()}
									disabled={isSearchDisabled}
								>
									{isSearching && <Loader2 className="w-4 h-4 animate-spin" />}
									Search
								</Button>
							</div>

							{/* Results area */}
							{!hasSearched ? (
								<div className="min-h-[160px] flex items-center justify-center">
									<p className="text-sm text-typo-tertiary">
										Enter at least 3 characters to search
									</p>
								</div>
							) : results.length === 0 ? (
								<div className="min-h-[160px] flex items-center justify-center">
									<p className="text-sm text-cgs-blue">No Results Found</p>
								</div>
							) : (
								<div className="flex flex-col overflow-hidden mt-4">
									{/* Result count */}
									<p className="md:text-sm text-typo-tertiary mb-2 shrink-0">
										Result found
									</p>

									{/* Result list */}
									<div className="overflow-y-auto flex-1 py-2">
										{
											isSearching ? <div className="w-full flex items-center justify-center min-h-[160px]">
												<Loader2 className="size-8 text-cgs-blue animate-spin text-center" />
											</div> :
												results.length === 0 ? <p className="text-sm text-typo-tertiary">No results found</p> :
													results.map((item) => (
														<Button
															key={item.accountNo}
															onClick={() => handleSelectAccount(item)}
															className={cn(
																"w-full h-fit cursor-pointer mt-1 justify-start transition-colors border hover:bg-background-selected bg-white py-3 px-4 text-sm md:text-base text-typo-primary font-normal",
																selectedAccount?.accountNo === item.accountNo &&
																"bg-cgs-blue/5",
															)}
														>
															<span className="">
																({item.accountSubType}) {item.accountNo}
															</span>
															<div className="ml-1 h-full w-1 text-typo-tertiary">|</div>
															<span className="flex-1 min-w-0 truncate text-left">{item.name}</span>

														</Button>
													))
										}
									</div>

									{/* Pagination */}
									{totalPages > 1 && (
										<Pagination className="mt-3 shrink-0">
											<PaginationContent>
												<PaginationItem>
													<PaginationPrevious
														onClick={() => handleSearch(Math.max(1, currentPage - 1))}
														className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
													/>
												</PaginationItem>

												{getPageNumbers(currentPage, totalPages).map((page, index) =>
													page === "..." ? (
														<PaginationItem key={`ellipsis-${index}`}>
															<PaginationEllipsis />
														</PaginationItem>
													) : (
														<PaginationItem key={page}>
															<PaginationLink
																isActive={page === currentPage}
																onClick={() => handleSearch(page)}
															>
																{page}
															</PaginationLink>
														</PaginationItem>
													)
												)}

												<PaginationItem>
													<PaginationNext
														onClick={() => handleSearch(Math.min(totalPages, currentPage + 1))}
														className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
													/>
												</PaginationItem>
											</PaginationContent>
										</Pagination>
									)}
								</div>
							)}
						</TabsContent>
					))}
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};

export default TRAccountSearchDialog;
