import { fetchAPI, postAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { APIResponse } from "@/lib/api/types";
import type {
	IAccountSummary,
	IExchangeRate,
	ITrustBalance,
	ITrustBalanceDetail,
	IPortfolioHolding,
	IContract,
	IContra,
	IContraDetail,
	IBorrowedShare,
	ILoanedShare,
	IPaynowTopUp,
	IPaynowTopUpResponse,
	ICDPTransfer,
	ICDPTransferStatus,
} from "@/types";

export const getAccountSummary = async (
	accountNo: string
): Promise<APIResponse<IAccountSummary>> => {
	return await fetchAPI<IAccountSummary>(ENDPOINTS.accountSummary(accountNo), { useAuth: true });
};

export const getFxRates = async (): Promise<APIResponse<IExchangeRate[]>> => {
	return await fetchAPI<IExchangeRate[]>(ENDPOINTS.fxRates(), { useAuth: true });
};

export const getTrustBalance = async (
	accountNo: string
): Promise<APIResponse<ITrustBalance[]>> => {
	return await fetchAPI<ITrustBalance[]>(ENDPOINTS.trustBalance(accountNo), { useAuth: true });
};

export const getTrustBalanceDetails = async (
	accountNo: string,
	pageSize?: number,
	pageIndex?: number
): Promise<APIResponse<{ total: number; trustBalanceDetails: ITrustBalanceDetail[] }>> => {
	return await fetchAPI<{ total: number; trustBalanceDetails: ITrustBalanceDetail[] }>(
		ENDPOINTS.trustBalanceDetails(accountNo, pageSize, pageIndex),
		{ useAuth: true }
	);
};

export const getHoldings = async (
	accountNo: string,
	pageSize?: number,
	pageIndex?: number
): Promise<APIResponse<{ total: number; portfolio: IPortfolioHolding[] }>> => {
	return await fetchAPI<{ total: number; portfolio: IPortfolioHolding[] }>(
		ENDPOINTS.holdings(accountNo, pageSize, pageIndex),
		{ useAuth: true }
	);
};

export const getContracts = async (
	accountNo: string,
	marketCode?: string,
	pageSize?: number,
	pageIndex?: number
): Promise<APIResponse<{ total: number; contracts: IContract[] }>> => {
	return await fetchAPI<{ total: number; contracts: IContract[] }>(
		ENDPOINTS.contracts(accountNo, marketCode, pageSize, pageIndex),
		{ useAuth: true }
	);
};

export const getContra = async (
	accountNo: string,
	marketCode?: string,
	pageSize?: number,
	pageIndex?: number
): Promise<APIResponse<{ total: number; contra: IContra[] }>> => {
	return await fetchAPI<{ total: number; contra: IContra[] }>(
		ENDPOINTS.contra(accountNo, marketCode, pageSize, pageIndex),
		{ useAuth: true }
	);
};

export const getContraDetails = async (
	accountNo: string,
	statementNo: string
): Promise<APIResponse<IContraDetail[]>> => {
	return await fetchAPI<IContraDetail[]>(
		ENDPOINTS.contraDetails(accountNo, statementNo),
		{ useAuth: true }
	);
};

export const getSblBorrowed = async (
	accountNo: string,
	marketCode?: string,
	pageSize?: number,
	pageIndex?: number
): Promise<APIResponse<{ total: number; borrowedShares: IBorrowedShare[] }>> => {
	return await fetchAPI<{ total: number; borrowedShares: IBorrowedShare[] }>(
		ENDPOINTS.sblBorrowed(accountNo, marketCode, pageSize, pageIndex),
		{ useAuth: true }
	);
};

export const getSblLoaned = async (
	accountNo: string,
	marketCode?: string,
	pageSize?: number,
	pageIndex?: number
): Promise<APIResponse<{ total: number; loanedShares: ILoanedShare[] }>> => {
	return await fetchAPI<{ total: number; loanedShares: ILoanedShare[] }>(
		ENDPOINTS.sblLoaned(accountNo, marketCode, pageSize, pageIndex),
		{ useAuth: true }
	);
};

export const depositPaynow = async (
	body: IPaynowTopUp
): Promise<APIResponse<IPaynowTopUpResponse>> => {
	return await postAPI<IPaynowTopUpResponse, IPaynowTopUp>(
		ENDPOINTS.depositPaynow(),
		body,
		{ useAuth: true }
	);
};

export const getCdpTransfer = async (): Promise<APIResponse<ICDPTransfer>> => {
	return await fetchAPI<ICDPTransfer>(ENDPOINTS.cdpTransfer(), { useAuth: true });
};

export const submitCdpTransfer = async (
	acctNo: string
): Promise<APIResponse<{ isSuccess: boolean }>> => {
	return await postAPI<{ isSuccess: boolean }, { acctNo: string }>(
		ENDPOINTS.submitCdpTransfer(),
		{ acctNo },
		{ useAuth: true }
	);
};

export const getCdpTransferStatus = async (): Promise<APIResponse<ICDPTransferStatus[]>> => {
	return await fetchAPI<ICDPTransferStatus[]>(ENDPOINTS.cdpTransferStatus(), { useAuth: true });
};

export const portfolioService = {
	getAccountSummary,
	getFxRates,
	getTrustBalance,
	getTrustBalanceDetails,
	getHoldings,
	getContracts,
	getContra,
	getContraDetails,
	getSblBorrowed,
	getSblLoaned,
	depositPaynow,
	getCdpTransfer,
	submitCdpTransfer,
	getCdpTransferStatus,
};

export default portfolioService;
