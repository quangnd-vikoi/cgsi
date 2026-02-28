"use client";

import React, { useEffect, useState } from "react";
import Alert from "@/components/Alert";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getContraDetails } from "@/lib/services/portfolioService";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import type { IContra } from "@/types";

interface ContraDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	contraId: string;
	contraDate: string;
	dueDate: string;
	netGainLoss: number;
	currency: string;
	statementNo: string;
}

export function ContraDetailsDialog({
	open,
	onOpenChange,
	contraId,
	contraDate,
	dueDate,
	netGainLoss,
	currency,
	statementNo,
}: ContraDetailsDialogProps) {
	const [details, setDetails] = useState<IContra[]>([]);
	const [loading, setLoading] = useState(false);
	const { selectedAccount } = useTradingAccountStore();

	useEffect(() => {
		if (!open || !selectedAccount?.accountNo || !statementNo) return;
		const fetchDetails = async () => {
			setLoading(true);
			const response = await getContraDetails(selectedAccount.accountNo, statementNo);
			if (response.success && response.data) {
				setDetails(response.data.contracts);
			}
			setLoading(false);
		};
		fetchDetails();
	}, [open, selectedAccount?.accountNo, statementNo]);

	return (
		<Alert
			open={open}
			onOpenChange={onOpenChange}
			title="Contra Details"
			className="sm:max-w-2xl"
			description={
				<div className="flex flex-col gap-4">
					{/* Summary Section */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 p-4 bg-background-section rounded">
						{/* Contra ID */}
						<div className="grid grid-cols-2 md:flex md:flex-col items-center md:items-start">
							<p className="text-sm text-typo-secondary md:mb-1">Contra ID</p>
							<p className="text-sm md:text-base font-medium text-typo-primary text-right md:text-left">
								{contraId}
							</p>
						</div>

						{/* Contra Date */}
						<div className="grid grid-cols-2 md:flex md:flex-col items-center md:items-start">
							<p className="text-sm text-typo-secondary md:mb-1">Contra Date</p>
							<p className="text-sm md:text-base font-medium text-typo-primary text-right md:text-left">
								{contraDate}
							</p>
						</div>

						{/* Due Date */}
						<div className="grid grid-cols-2 md:flex md:flex-col items-center md:items-start">
							<p className="text-sm text-typo-secondary md:mb-1">Due Date</p>
							<p className="text-sm md:text-base font-medium text-typo-primary text-right md:text-left">
								{dueDate}
							</p>
						</div>

						{/* Net Gain/Loss */}
						<div className="grid grid-cols-2 md:flex md:flex-col items-center md:items-start">
							<p className="text-sm text-typo-secondary md:mb-1">Net Gain/ Loss</p>
							<p
								className={`text-sm md:text-base font-medium text-right md:text-left ${netGainLoss >= 0 ? "text-status-success" : "text-status-error"
									}`}
							>
								{netGainLoss >= 0 ? "+" : "-"}{" "}
								{Math.abs(netGainLoss).toLocaleString("en-US", {
									minimumFractionDigits: 2,
								})}{" "}
								{currency}
							</p>
						</div>
					</div>

					{/* Table Section */}
					<div className="overflow-x-auto rounded">
						<Table>
							<TableHeader>
								<TableRow className="bg-background-section border-b border-stroke-secondary [&>th]:text-xs [&>th]:font-semibold [&>th]:text-typo-primary [&>th]:whitespace-nowrap [&>th]:px-4 [&>th]:py-3">
									<TableHead>Trade Date</TableHead>
									<TableHead>Contract ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Currency</TableHead>
									<TableHead className="text-right">Gain/ Loss</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-8 text-sm text-typo-secondary">
											Loading...
										</TableCell>
									</TableRow>
								) : details.length === 0 ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-8 text-sm text-typo-secondary">
											No details available
										</TableCell>
									</TableRow>
								) : (
									details.map((detail, index) => (
										<TableRow
											key={index}
											className="border-b border-stroke-secondary last:border-0 [&>td]:text-sm [&>td]:text-typo-primary [&>td]:whitespace-nowrap [&>td]:px-4 [&>td]:py-3"
										>
											<TableCell>{detail.statementDate}</TableCell>
											<TableCell>{detail.statementNo}</TableCell>
											<TableCell>{detail.securityName}</TableCell>
											<TableCell>{detail.settlementCurrency}</TableCell>
											<TableCell
												className={`text-right ${detail.settlementNetAmount >= 0
													? "!text-status-success"
													: "!text-status-error"
													}`}
											>
												{detail.settlementNetAmount >= 0 ? "+" : "-"}{" "}
												{Math.abs(detail.settlementNetAmount).toLocaleString("en-US", {
													minimumFractionDigits: 2,
												})}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			}
			cancelText=""
			actionText="Close"
		/>
	);
}
