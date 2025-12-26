import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { CashTransaction } from "../../_components/data";

interface CashTransactionsTableProps {
	transactions: CashTransaction[];
}

export function CashTransactionsTable({ transactions }: CashTransactionsTableProps) {
	return (
		<div className="overflow-x-auto rounded-l-lg rounded-r-none md:rounded-r-lg mb-4 -mr-4 md:mr-0">
			<Table>
				<TableHeader>
					<TableRow className="bg-background-section border-b border-stroke-secondary [&>th]:text-xs [&>th]:md:text-sm [&>th]:font-semibold [&>th]:text-typo-primary [&>th]:whitespace-nowrap [&>th]:px-4 [&>th]:py-4">
						<TableHead>Transaction ID</TableHead>
						<TableHead>Transaction Date</TableHead>
						<TableHead>Description</TableHead>
						<TableHead className="text-right">Currency</TableHead>
						<TableHead className="text-right">Traded Price</TableHead>
						<TableHead className="text-right">Quantity</TableHead>
						<TableHead className="text-right">Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions.map((transaction) => (
						<TableRow
							key={transaction.id}
							className="border-b border-stroke-secondary last:border-0 hover:bg-background-section/50 [&>td]:text-xs [&>td]:md:text-sm [&>td]:text-typo-primary [&>td]:whitespace-nowrap [&>td]:px-4 [&>td]:py-3"
						>
							<TableCell>{transaction.transactionId}</TableCell>
							<TableCell>{transaction.transactionDate}</TableCell>
							<TableCell>{transaction.description}</TableCell>
							<TableCell className="text-right">{transaction.currency}</TableCell>
							<TableCell className="text-right">
								{transaction.tradedPrice.toFixed(3)}
							</TableCell>
							<TableCell className="text-right">{transaction.quantity}</TableCell>
							<TableCell
								className={`text-right ${transaction.amount > 0 ? "!text-status-success" : "!text-status-error"
									}`}
							>
								{transaction.amount > 0 ? "+" : ""} {transaction.amount.toLocaleString("en-US", {
									minimumFractionDigits: 2,
								})}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
