import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { CGSI } from "@/constants/routes";
import Link from "next/link";
import type { Contract } from "../../_components/data";

interface ContractsTableProps {
	contracts: Contract[];
	activeTab: "contracts" | "contra";
	onOpenContraDetails: (contract: Contract) => void;
}

export function ContractsTable({ contracts, activeTab, onOpenContraDetails }: ContractsTableProps) {
	return (
		<div className="overflow-x-auto rounded-lg border border-stroke-secondary mb-4">
			<Table>
				<TableHeader>
					<TableRow className="bg-background-section border-b border-stroke-secondary [&>th]:text-xs [&>th]:font-semibold [&>th]:text-typo-primary [&>th]:whitespace-nowrap [&>th]:px-4 [&>th]:py-4">
						<TableHead>Contract ID</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Trade Date</TableHead>
						<TableHead>Due Date</TableHead>
						<TableHead className="text-right">Settlement Ccy</TableHead>
						<TableHead className="text-right">Gain/Loss</TableHead>
						<TableHead>Side</TableHead>
						<TableHead>Market</TableHead>
						<TableHead className="!px-4">Code</TableHead>
						<TableHead className="text-center sticky !px-9 right-0 bg-background-section">
							Action
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{contracts.map((contract) => (
						<TableRow
							key={contract.id}
							className="border-b border-stroke-secondary last:border-0 hover:bg-background-section/50 [&>td]:text-sm [&>td]:text-typo-primary [&>td]:whitespace-nowrap [&>td]:px-3 [&>td]:py-3"
						>
							<TableCell>{contract.contractId}</TableCell>
							<TableCell>
								<span
									className={`px-2 py-1 rounded text-xs ${
										contract.status === "Overdue" ? "text-status-error" : "text-typo-primary"
									}`}
								>
									{contract.status}
								</span>
							</TableCell>
							<TableCell>{contract.tradeDate}</TableCell>
							<TableCell>{contract.dueDate}</TableCell>
							<TableCell className="text-right">{contract.settlementCcy}</TableCell>
							<TableCell
								className={`text-right ${
									contract.gainLoss > 0 ? "!text-status-success" : "!text-status-error"
								}`}
							>
								{contract.gainLoss > 0 ? "+" : "-"}{" "}
								{Math.abs(contract.gainLoss).toLocaleString("en-US", {
									minimumFractionDigits: 2,
								})}
							</TableCell>
							<TableCell>{contract.side}</TableCell>
							<TableCell>{contract.market}</TableCell>
							<TableCell>{contract.code}</TableCell>
							<TableCell className="text-center sticky right-0 bg-white flex gap-2 justify-center">
								{activeTab === "contra" && (
									<Button
										size="sm"
										variant="outline"
										onClick={() => onOpenContraDetails(contract)}
										className="shadow-none border-none font-normal text-enhanced-blue hover:bg-enhanced-blue/10 rounded px-3"
									>
										Detail
									</Button>
								)}
								<Link href={CGSI.PAYMENT} target="_blank">
									<Button
										size="sm"
										disabled={contract.gainLoss >= 0}
										className="bg-enhanced-blue font-normal hover:bg-enhanced-blue/90 text-white rounded px-3 disabled:bg-status-disable-primary"
									>
										Pay
									</Button>
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
