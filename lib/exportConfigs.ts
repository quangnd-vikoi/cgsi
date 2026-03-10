import type { ExportColumn } from "@/lib/exportToExcel";
import type {
	IPortfolioHolding,
	IBorrowedShare,
	ILoanedShare,
	ITrustBalanceDetail,
} from "@/types";
import type { ContractDisplay } from "@/app/(with-layout)/portfolio/settle/_components/ContractsTable";

export const holdingsColumns: ExportColumn<IPortfolioHolding>[] = [
	{ header: "Asset Class", accessor: "assetClass" },
	{ header: "Market", accessor: "marketCode" },
	{ header: "Code", accessor: "securityCode" },
	{ header: "Name", accessor: "securityName" },
	{ header: "Total Qty", accessor: "totalQty" },
	{ header: "Earmarked", accessor: (r) => r.earmarkQty ?? 0 },
	{ header: "Avail Qty", accessor: (r) => r.availQty ?? 0 },
	{ header: "Currency", accessor: "currency" },
	{ header: "Closing Price", accessor: "closingPrice" },
	{ header: "Market Value", accessor: "marketValue" },
];

export const borrowedSharesColumns: ExportColumn<IBorrowedShare>[] = [
	{ header: "Asset Class", accessor: "assetClass" },
	{ header: "Market", accessor: "marketCode" },
	{ header: "Code", accessor: "securityCode" },
	{ header: "Name", accessor: "securityName" },
	{ header: "Borrowed Qty", accessor: "borrowedQty" },
	{ header: "Pend. In", accessor: "pendingIn" },
	{ header: "Pend. Out", accessor: "pendingOut" },
	{ header: "Net Qty", accessor: (r) => r.borrowedQty + r.pendingIn - r.pendingOut },
	{ header: "Currency", accessor: "currency" },
	{ header: "Closing Price", accessor: "closingPrice" },
	{ header: "Borrow Value", accessor: "marketValue" },
];

export const loanedSharesColumns: ExportColumn<ILoanedShare>[] = [
	{ header: "Asset Class", accessor: "assetClass" },
	{ header: "Market", accessor: "marketCode" },
	{ header: "Code", accessor: "securityCode" },
	{ header: "Name", accessor: "securityName" },
	{ header: "Loaned Qty", accessor: "loanedQty" },
	{ header: "Currency", accessor: "currency" },
	{ header: "Closing Price", accessor: "closingPrice" },
	{ header: "Lending Value", accessor: "lendingValue" },
];

export const cashTransactionColumns: ExportColumn<ITrustBalanceDetail>[] = [
	{ header: "Transaction ID", accessor: "transactionNo" },
	{ header: "Date", accessor: "transactionDate" },
	{ header: "Description", accessor: "description" },
	{ header: "Currency", accessor: "currency" },
	{ header: "Debit", accessor: "debit" },
	{ header: "Credit", accessor: "credit" },
	{ header: "Balance", accessor: "balance" },
];

export const contractsColumns: ExportColumn<ContractDisplay>[] = [
	{ header: "Contract ID", accessor: "contractId" },
	{ header: "Status", accessor: "status" },
	{ header: "Trade Date", accessor: "tradeDate" },
	{ header: "Due Date", accessor: "dueDate" },
	{ header: "Settlement Ccy", accessor: "settlementCcy" },
	{ header: "Gain/Loss", accessor: "gainLoss" },
	{ header: "Side", accessor: "side" },
	{ header: "Market", accessor: "market" },
	{ header: "Code", accessor: "code" },
];
