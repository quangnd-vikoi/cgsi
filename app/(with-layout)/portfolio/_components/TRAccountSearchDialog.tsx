"use client";

import { useState, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import type { TradingAccount } from "@/types";
import { Separator } from "@/components/ui/separator";

const SEARCH_TABS = [
	{ value: "account-no", label: "Account No.", placeholder: "Enter Account Number" },
	{ value: "client-name", label: "Client Name", placeholder: "Enter Client Name" },
	{ value: "nric", label: "NRIC", placeholder: "Enter NRIC" },
] as const;

const PER_PAGE = 10;

// Mock data for testing search
const MOCK_ACCOUNTS: (TradingAccount & { clientName: string; nric: string })[] = [
	{
		accountNo: "001234",
		accountType: "CTA",
		clientName: "John Tan Wei Ming",
		nric: "S1234567A",
		trName: "Alice Rep",
		trCode: "TR001",
	},
	{
		accountNo: "001235",
		accountType: "CTA",
		clientName: "Sarah Lim Mei Ling",
		nric: "S2345678B",
		trName: "Alice Rep",
		trCode: "TR001",
	},
	{
		accountNo: "002001",
		accountType: "MTA",
		clientName: "David Wong Kah Hee",
		nric: "S3456789C",
		trName: "Bob Rep",
		trCode: "TR002",
	},
	{
		accountNo: "002002",
		accountType: "MTA",
		clientName: "Emily Chen Xiu Wen",
		nric: "S4567890D",
		trName: "Bob Rep",
		trCode: "TR002",
	},
	{
		accountNo: "003001",
		accountType: "SBL",
		clientName: "Michael Ng Jun Wei",
		nric: "S5678901E",
		trName: "Alice Rep",
		trCode: "TR001",
	},
	{
		accountNo: "004001",
		accountType: "CUT",
		clientName: "Rachel Goh Siew Lan",
		nric: "S6789012F",
		trName: "Charlie Rep",
		trCode: "TR003",
	},
	{
		accountNo: "001236",
		accountType: "CTA",
		clientName: "Kevin Lee Chong Beng",
		nric: "S7890123G",
		trName: "Charlie Rep",
		trCode: "TR003",
	},
	{
		accountNo: "001237",
		accountType: "CTA",
		clientName: "Amanda Teo Pei Shan",
		nric: "S8901234H",
		trName: "Alice Rep",
		trCode: "TR001",
	},
	{
		accountNo: "002003",
		accountType: "MTA",
		clientName: "Daniel Ong Wee Kiat",
		nric: "S9012345I",
		trName: "Bob Rep",
		trCode: "TR002",
	},
	{
		accountNo: "001238",
		accountType: "CTA",
		clientName: "Jessica Koh Hui Min",
		nric: "S0123456J",
		trName: "Charlie Rep",
		trCode: "TR003",
	},
	{
		accountNo: "003002",
		accountType: "SBL",
		clientName: "Brandon Lim Kok Leong",
		nric: "T1234567A",
		trName: "Alice Rep",
		trCode: "TR001",
	},
	{
		accountNo: "001239",
		accountType: "CTA",
		clientName: "Nicole Tan Su Lin",
		nric: "T2345678B",
		trName: "Bob Rep",
		trCode: "TR002",
	},
	{
		accountNo: "002004",
		accountType: "MTA",
		clientName: "Ryan Chua Boon Huat",
		nric: "T3456789C",
		trName: "Charlie Rep",
		trCode: "TR003",
	},
	{
		accountNo: "004002",
		accountType: "CUT",
		clientName: "Grace Wong Pei Yi",
		nric: "T4567890D",
		trName: "Alice Rep",
		trCode: "TR001",
	},
	{
		accountNo: "001240",
		accountType: "CTA",
		clientName: "Samuel Yeo Teck Seng",
		nric: "T5678901E",
		trName: "Bob Rep",
		trCode: "TR002",
	},
	{
		accountNo: "002005",
		accountType: "MTA",
		clientName: "Linda Sim Bee Hoon",
		nric: "T6789012F",
		trName: "Charlie Rep",
		trCode: "TR003",
	},
	{
		accountNo: "001241",
		accountType: "CTA",
		clientName: "Marcus Foo Chee Keong",
		nric: "T7890123G",
		trName: "Alice Rep",
		trCode: "TR001",
	},
	{
		accountNo: "003003",
		accountType: "SBL",
		clientName: "Cheryl Ang Shu Ting",
		nric: "T8901234H",
		trName: "Bob Rep",
		trCode: "TR002",
	},
	{
		accountNo: "001242",
		accountType: "CTA",
		clientName: "Justin Tay Ming Hao",
		nric: "T9012345I",
		trName: "Charlie Rep",
		trCode: "TR003",
	},
	{
		accountNo: "002006",
		accountType: "MTA",
		clientName: "Vanessa Ho Yee Ling",
		nric: "T0123456J",
		trName: "Alice Rep",
		trCode: "TR001",
	},
	{
		accountNo: "001243",
		accountType: "CTA",
		clientName: "Patrick Chng Wei Jie",
		nric: "S1122334A",
		trName: "Bob Rep",
		trCode: "TR002",
	},
	{
		accountNo: "004003",
		accountType: "CUT",
		clientName: "Felicia Loh Mei Xin",
		nric: "S2233445B",
		trName: "Charlie Rep",
		trCode: "TR003",
	},
	{
		accountNo: "002007",
		accountType: "MTA",
		clientName: "Andrew Poh Kok Wai",
		nric: "S3344556C",
		trName: "Alice Rep",
		trCode: "TR001",
	},
	{
		accountNo: "001244",
		accountType: "CTA",
		clientName: "Samantha Ng Li Hua",
		nric: "S4455667D",
		trName: "Bob Rep",
		trCode: "TR002",
	},
	{
		accountNo: "003004",
		accountType: "SBL",
		clientName: "Timothy Seah Zheng Yu",
		nric: "S5566778E",
		trName: "Charlie Rep",
		trCode: "TR003",
	},
];

interface TRAccountSearchDialogProps {
	onSelectAccount: (account: TradingAccount) => void;
	selectedAccount: TradingAccount | null;
	isTRClientAccount: boolean;
	fullWidth?: boolean;
}

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
	const [results, setResults] = useState<typeof MOCK_ACCOUNTS>([]);
	const [hasSearched, setHasSearched] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const handleSearch = () => {
		if (!searchQuery.trim()) return;

		setIsSearching(true);
		setCurrentPage(1);

		// Simulate API delay
		setTimeout(() => {
			const query = searchQuery.toLowerCase();
			const filtered = MOCK_ACCOUNTS.filter((account) => {
				if (activeTab === "account-no") return account.accountNo.toLowerCase().includes(query);
				if (activeTab === "client-name") return account.clientName.toLowerCase().includes(query);
				if (activeTab === "nric") return account.nric.toLowerCase().includes(query);
				return false;
			});

			setResults(filtered);
			setHasSearched(true);
			setIsSearching(false);
		}, 800);
	};

	const handleSelectAccount = (account: (typeof MOCK_ACCOUNTS)[number]) => {
		onSelectAccount(account);
		setOpen(false);
		resetState();
	};

	const resetState = () => {
		setSearchQuery("");
		setResults([]);
		setHasSearched(false);
		setCurrentPage(1);
	};

	const totalPages = Math.ceil(results.length / PER_PAGE);
	const paginatedResults = useMemo(
		() => results.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
		[results, currentPage],
	);

	const pageNumbers = useMemo(() => {
		const pages: number[] = [];
		for (let i = 1; i <= totalPages; i++) pages.push(i);
		return pages;
	}, [totalPages]);

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
									onClick={handleSearch}
									disabled={isSearching || !searchQuery.trim()}
								>
									{isSearching && <Loader2 className="w-4 h-4 animate-spin" />}
									Search
								</Button>
							</div>

							{/* Results area */}
							{!hasSearched ? (
								<div className="min-h-[160px] flex items-center justify-center">
									<p className="text-sm text-typo-tertiary">
										Enter a search term to find accounts
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
										{paginatedResults.map((account) => (
											<Button
												key={account.accountNo}
												onClick={() => handleSelectAccount(account)}
												className={cn(
													"w-full h-fit cursor-pointer mt-1 justify-start transition-colors border hover:bg-background-selected bg-white py-3 px-4 text-rsp-sm text-typo-primary font-normal",
													selectedAccount?.accountNo === account.accountNo &&
														"bg-cgs-blue/5",
												)}
											>
												<span className="w-1/4">
													({account.accountType}) {account.accountNo}
												</span>
												<div className="ml-2 h-full w-1 text-typo-tertiary">|</div>
												<span className="">{account.clientName}</span>
											</Button>
										))}
									</div>

									{/* Pagination */}
									{totalPages > 1 && (
										<Pagination className="mt-3 shrink-0">
											<PaginationContent>
												<PaginationItem>
													<PaginationPrevious
														onClick={() =>
															setCurrentPage((p) => Math.max(1, p - 1))
														}
														className={cn(
															currentPage === 1 &&
																"pointer-events-none opacity-50",
														)}
													/>
												</PaginationItem>
												{pageNumbers.map((page) => (
													<PaginationItem key={page}>
														<PaginationLink
															isActive={page === currentPage}
															onClick={() => setCurrentPage(page)}
														>
															{page}
														</PaginationLink>
													</PaginationItem>
												))}
												<PaginationItem>
													<PaginationNext
														onClick={() =>
															setCurrentPage((p) => Math.min(totalPages, p + 1))
														}
														className={cn(
															currentPage === totalPages &&
																"pointer-events-none opacity-50",
														)}
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
