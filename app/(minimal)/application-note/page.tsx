"use client";

import Image from "@/components/Image";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Printer } from "lucide-react";
import React from "react";

const APPLICATION_INFO = [
	{ label: "Client Name", value: "RAYHAN ABHIRAMA" },
	{ label: "Account No.", value: "6450371" },
	{ label: "Purchase/Sale", value: "IPO Application" },
	{ label: "Tax Note No.", value: "IPO-202407-00001" },
	{ label: "Note Generated Date", value: "13-Oct-2025" },
	{ label: "Application Date", value: "13-Oct-2025" },
];

const PAYMENT_BREAKDOWN = [
	{ label: "Gross Proceeds", value: "1,500.00 USD" },
	{ label: "Commission", value: "120.00 USD" },
	{ label: "Admin Fee", value: "0.00 USD" },
	{ label: "GST (9.0%*)", value: "10.80 USD" },
	{ label: "Total", value: "1,630.80 USD" },
	{ label: "Conversion Rate to USD", value: "1.0" },
	{ label: "Amount Payable", value: "1,630.80 USD", bold: true },
];

const Note = () => {
	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="bg-black/75 min-h-screen">
			<div className="max-w-[1240px] bg-white mx-auto p-6">
				{/* Phần này sẽ BỊ ẨN khi print */}
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

				{/* CHỈ PHẦN NÀY được print */}
				<div className="printable-content">
					<div className="flex justify-between">
						<h2 className="text-lg font-semibold">IOP Application Note</h2>
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
							{APPLICATION_INFO.map((item, index) => (
								<div key={index} className="flex justify-between text-typo-primary">
									<div className="text-xs font-normal">{item.label}</div>
									<div className="text-xs font-medium">{item.value}</div>
								</div>
							))}
						</div>

						<div className="col-span-1 grid grid-rows-2 gap-4">
							<div className="row-span-1 bg-background-section p-4">
								<p className="text-typo-secondary text-sm font-semibold">Payable Amount</p>
								<p className="text-typo-primary  text-lg font-semibold mt-2">1,630.80 USD</p>
							</div>
							<div className="row-span-1 border border-status-warning rounded-lg p-4 text-sm text-typo-primary font-semibold">
								<div className="flex justify-between *:items-center">
									<div className="flex gap-2 ">
										<Clock className="text-status-warning" size={24} />
										<span>Awaiting Payment</span>
									</div>
									<div className="">Due 13-Oct-2025, 17:00 SGT</div>
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
								<TableHead className="w-3/7 !text-left">IOP</TableHead>
								<TableHead>No. of Units</TableHead>
								<TableHead className="w-1/5">Unit Price</TableHead>
								<TableHead>Gross Proceeds</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow className="*:text-right">
								<TableCell className="font-medium !text-left">INV001</TableCell>
								<TableCell>1000</TableCell>
								<TableCell>1.50 USD</TableCell>
								<TableCell>1,500.00 USD </TableCell>
							</TableRow>
						</TableBody>
					</Table>

					<div className="my-6 text-right">
						<div className="p-4 bg-theme-neutral-095 max-w-[467px] space-y-1">
							{PAYMENT_BREAKDOWN.map((item, index) => (
								<div key={index} className="text-xs">
									<span className="font-normal">{item.label}:</span>{" "}
									<span className="font-medium">{item.value}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Note;
