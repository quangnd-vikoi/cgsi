"use client";

import Image from "@/components/Image";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Printer } from "lucide-react";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { subscriptionService } from "@/lib/services/subscriptionService";
import type { UserProductSubscriptionDetailResponse } from "@/types";
import { ErrorState } from "@/components/ErrorState";

const NoteContent = () => {
	const searchParams = useSearchParams();
	const subscriptionId = searchParams.get("subscriptionId");

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [details, setDetails] = useState<UserProductSubscriptionDetailResponse | null>(null);

	useEffect(() => {
		const fetchDetails = async () => {
			if (!subscriptionId) {
				setError("No subscription ID provided");
				setLoading(false);
				return;
			}
			setLoading(true);
			setError(null);
			const response = await subscriptionService.getUserSubscriptionDetails(subscriptionId);
			if (response.success && response.data) {
				setDetails(response.data);
			} else {
				setError(response.error || "Failed to load subscription details");
			}
			setLoading(false);
		};

		fetchDetails();
	}, [subscriptionId]);

	const handlePrint = () => {
		window.print();
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	const formatDateTime = (dateString?: string) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			timeZoneName: "short",
		});
	};

	const formatCurrency = (amount?: number, currency?: string) => {
		if (amount === undefined || amount === null) return "0.00";
		return `${amount.toFixed(2)} ${currency || "USD"}`;
	};

	if (loading) {
		return (
			<div className="bg-black/75 min-h-screen flex items-center justify-center">
				<div className="max-w-[1240px] bg-white mx-auto p-6 rounded-lg">
					<div className="space-y-4">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="animate-pulse flex gap-4">
								<div className="h-12 bg-gray-200 rounded flex-1"></div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error || !details) {
		return (
			<div className="bg-black/75 min-h-screen flex items-center justify-center">
				<div className="max-w-[1240px] bg-white mx-auto p-6 rounded-lg">
					<div className="flex items-center justify-center">
						<ErrorState
							type="error"
							description={error || "Subscription details not found"}
						/>
					</div>
				</div>
			</div>
		);
	}

	const applicationInfo = [
		{ label: "Client Name", value: details.clientName || "N/A" },
		{ label: "Account No.", value: details.accountNo || "N/A" },
		{ label: "Purchase/Sale", value: `${details.productType || "Product"} Application` },
		{ label: "Tax Note No.", value: details.taxNoteNo || "N/A" },
		{ label: "Note Generated Date", value: formatDate(details.noteGenerateDate) },
		{ label: "Application Date", value: formatDate(details.applicationDate) },
	];

	const grossProceed = details.grossProceed || 0;
	const commission = details.commission || 0;
	const adminFee = details.adminFee || 0;
	const gstAmount = details.gstAmount || 0;
	const gstPct = details.gstPct || 9.0;
	const total = grossProceed + commission + adminFee;
	const conversionRate = details.conversionRate || 1.0;
	const amountPayable = details.amountPayable || total + gstAmount;
	const paymentCurrency = details.paymentCurrency || "USD";

	const paymentBreakdown: Array<{
		label: string;
		value: string;
		bold?: boolean;
		sublabel?: string;
	}> = [
		{ label: "Gross Proceeds", value: formatCurrency(grossProceed, paymentCurrency) },
		{ label: "Placement Fee", value: formatCurrency(commission, paymentCurrency) },
		{ label: "Admin Fee", value: formatCurrency(adminFee, paymentCurrency) },
		{
			label: `GST (${gstPct}%)`,
			sublabel: "based on Placement Fee and Admin Fee",
			value: formatCurrency(gstAmount, paymentCurrency),
		},
		{ label: "Total", value: formatCurrency(total, paymentCurrency) },
		{ label: `Conversion Rate to ${paymentCurrency}`, value: conversionRate.toFixed(1) },
		{ label: "Amount Payable", value: formatCurrency(amountPayable, paymentCurrency), bold: true },
	];

	return (
		<div className="bg-black/75 min-h-screen">
			<div className="max-w-[1240px] bg-white mx-auto p-6">
				{/* Header section - hidden when printing */}
				<div className="print:hidden">
					<div className="flex justify-between">
						<h1 className="text-lg font-semibold">Application Success!</h1>
						<div
							className="text-enhanced-blue flex gap-2 cursor-pointer hover:underline"
							onClick={handlePrint}
						>
							<Printer className="text-enhanced-blue" />
							Print
						</div>
					</div>
					<Separator className="my-6" />
				</div>

				{/* Printable content */}
				<div className="printable-content">
					<div className="flex justify-between">
						<h2 className="text-lg font-semibold">
							{details.productType || "Product"} Application Note
						</h2>
						<Image
							src={"/images/application-note-logo.png"}
							alt="CGS Logo"
							width={100}
							height={52}
							className="w-fit"
						/>
					</div>

					<div className="mt-8 grid grid-cols-2 gap-6">
						<div className="col-span-1 flex flex-col justify-between space-y-auto">
							<h3 className="text-sm font-semibold text-typo-secondary">Account Details</h3>
							{applicationInfo.map((item, index) => (
								<div key={index} className="flex justify-between text-typo-primary">
									<div className="text-xs font-normal">{item.label}</div>
									<div className="text-xs font-medium">{item.value}</div>
								</div>
							))}
						</div>

						<div className="col-span-1 grid grid-rows-2 gap-4">
							<div className="row-span-1 bg-background-section p-4">
								<p className="text-typo-secondary text-sm font-semibold">Payable Amount</p>
								<p className="text-typo-primary text-lg font-semibold mt-2">
									{formatCurrency(amountPayable, paymentCurrency)}
								</p>
							</div>
							<div className="row-span-1 border border-status-warning rounded-lg p-4 text-sm text-typo-primary font-semibold">
								<div className="flex justify-between *:items-center">
									<div className="flex gap-2">
										<Clock className="text-status-warning" size={24} />
										<span>Awaiting Payment</span>
									</div>
									<div>Due {formatDateTime(details.paymentDueDate)}</div>
								</div>

								<div className="mt-3 pl-1">
									<ul className="list-disc list-inside text-xs font-normal">
										<li>Otherwise application may be voided and NOT be processed</li>
										<li>Inform your Trading Representative of any payment made.</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					<Separator className="my-6" />

					<Table>
						<TableHeader>
							<TableRow className="*:text-right bg-theme-neutral-09">
								<TableHead className="w-3/7 !text-left">
									{details.productType || "Product"}
								</TableHead>
								<TableHead>No. of Units</TableHead>
								<TableHead className="w-1/5">Unit Price</TableHead>
								<TableHead>Gross Proceeds</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow className="*:text-right">
								<TableCell className="font-medium !text-left">
									{details.productName || "N/A"} ({details.stockCode || "N/A"})
								</TableCell>
								<TableCell>{details.totalUnit || 0}</TableCell>
								<TableCell>
									{formatCurrency(details.issuePrice, details.baseCurrency)}
								</TableCell>
								<TableCell>
									{formatCurrency(details.grossProceed, paymentCurrency)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					<div className="my-6 flex justify-end">
						<div className="p-4 bg-theme-neutral-095 max-w-[467px] space-y-1">
							{paymentBreakdown.map((item, index) => (
								<div key={index} className="text-xs">
									<span className={item.bold ? "font-semibold" : "font-normal"}>
										{item.label}
										{item.sublabel && (
											<span className="text-typo-tertiary text-[10px] ml-1">
												{item.sublabel}
											</span>
										)}
										:
									</span>{" "}
									<span className={item.bold ? "font-semibold" : "font-medium"}>
										{item.value}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Settlement Modes Section */}
					<div className="mt-8">
						<h3 className="text-base font-semibold mb-4">Settlement Modes</h3>

						<div className="grid grid-cols-3 gap-4 mb-4">
							{/* Internet Banking */}
							<div className="border border-stroke-secondary rounded-lg p-4">
								<h4 className="text-sm font-semibold mb-3">Internet Banking (FAST/Bill Payment)</h4>
								<div className="space-y-2 text-xs">
									<p>
										<span className="text-typo-secondary">Company Payee Name:</span>{" "}
										<span className="font-medium">CGSI Securities (SG) Pte Ltd</span>
									</p>
									<p>
										<span className="text-typo-secondary">Reference No:</span>{" "}
										<span className="font-medium">
											&lt;CGSI trading account number&gt; + Tax Note Number
										</span>
									</p>
								</div>
							</div>

							{/* Pay Now */}
							<div className="border border-stroke-secondary rounded-lg p-4">
								<h4 className="text-sm font-semibold mb-3">Pay Now</h4>
								<div className="space-y-2 text-xs">
									<p>
										<span className="text-typo-secondary">Company UEN:</span>{" "}
										<span className="font-medium">198701621D|EO1</span>
									</p>
									<p>
										<span className="text-typo-secondary">Company Payee Name:</span>{" "}
										<span className="font-medium">CGSI S (S) P-CTA</span>
									</p>
									<p>
										<span className="text-typo-secondary">Reference No:</span>{" "}
										<span className="font-medium">
											&lt;CGSI trading account number&gt; + Tax Note Number
										</span>
									</p>
								</div>
							</div>

							{/* Telegraphic Transfer */}
							<div className="border border-stroke-secondary rounded-lg p-4">
								<h4 className="text-sm font-semibold mb-3">Telegraphic Transfer</h4>
								<div className="space-y-2 text-xs">
									<p className="text-typo-secondary">
										Please click{" "}
										<span className="text-enhanced-blue cursor-pointer">here</span> for
										details.
									</p>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-4">
							{/* GIRO */}
							<div className="border border-stroke-secondary rounded-lg p-4">
								<h4 className="text-sm font-semibold mb-3">GIRO</h4>
								<div className="space-y-2 text-xs">
									<p className="text-typo-secondary">
										GIRO Bank Account: Ensure sufficient funds in GIRO bank account by next
										working day
									</p>
								</div>
							</div>

							{/* Trust Account */}
							<div className="border border-stroke-secondary rounded-lg p-4">
								<h4 className="text-sm font-semibold mb-3">Trust Account</h4>
								<div className="space-y-2 text-xs">
									<p className="text-typo-secondary">
										Please give instruction to you Trading Representative to debit from your
										CGSI trust account.
									</p>
									<p>
										<span className="text-typo-secondary">Reference No:</span>{" "}
										<span className="font-medium">
											&lt;CGSI trust account number&gt; + Tax Note Number
										</span>
									</p>
								</div>
							</div>

							{/* Margin Account */}
							<div className="border border-stroke-secondary rounded-lg p-4">
								<h4 className="text-sm font-semibold mb-3">Margin Account:</h4>
								<div className="space-y-2 text-xs">
									<p className="text-typo-secondary">
										Please give instruction to you Trading Representative to debit from your
										CGSI margin account.
									</p>
									<p>
										<span className="text-typo-secondary">Reference No:</span>{" "}
										<span className="font-medium">
											&lt;CGSI margin account number&gt; + Tax Note Number
										</span>
									</p>
								</div>
							</div>
						</div>

						<div className="mt-6 text-right text-xs text-typo-secondary">
							<p className="font-semibold">Retail Management</p>
							<p>CGS International Securities Singapore Pte Ltd</p>
							<p>GST Registration No. MR-85001374</p>
						</div>

						<div className="mt-6 border-t border-stroke-secondary pt-4">
							<p className="text-xs text-typo-secondary">
								For any queries, please email to{" "}
								<a
									href="mailto:sg.retailmgmtsupport@cgsi.com"
									className="text-enhanced-blue hover:underline"
								>
									sg.retailmgmtsupport@cgsi.com
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const Note = () => {
	return (
		<Suspense
			fallback={
				<div className="bg-black/75 min-h-screen flex items-center justify-center">
					<div className="max-w-[1240px] bg-white mx-auto p-6 rounded-lg">
						<div className="space-y-4">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="animate-pulse flex gap-4">
									<div className="h-12 bg-gray-200 rounded flex-1"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			}
		>
			<NoteContent />
		</Suspense>
	);
};

export default Note;
