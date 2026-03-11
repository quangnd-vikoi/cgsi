export interface INotification {
	id: string; // Required for mark as read functionality
	title: string;
	description: string;
	category: string; // Notification category for filtering/grouping
	status: "R" | "U"; // "R" = Read, "U" = Unread
	createdOn: string; // ISO 8601 date-time format
	imageUrl?: string; // Optional image URL for notification
}

// API Response Types for Notifications
export interface NotificationListResponse {
	total: number;
	notifications: INotification[];
}

export interface NotificationMarkAsReadRequest {
	ids: string[]; // Array of notification IDs to mark as read (minItems: 1)
}

export interface NotificationMarkAsReadResponse {
	isSuccess: boolean;
}

export interface IEventProps {
	id: string;
	title: string;
	imageUrl: string;
	description: string;
	date: string;
	time: string;
	location: string;
}

export type PortfolioType = "CTA" | "MTA" | "SBL" | "CUT" | "iCash";

export type SheetType =
	| "notification"
	| "profile"
	| "announcement"
	| "contact"
	| "trading_representative"
	| "client_services"
	| "central_dealing_desk"
	| "password_and_security"
	| "detail_notification"
	| "acknowledgements"
	| "trading_declarations"
	| "trading_accounts"
	| "trading_account_details"
	| "user_profile"
	| "my_subscriptions"
	| null;

export interface IResearchArticleProps {
	id: string;
	title: string;
	description: string;
	date: string;
	author: string;
	tag: string;
	url: string;
}

// API Response type for GET /notification/api/v1/research/articles
export interface IResearchArticle {
	id: string;
	type: string;
	title: string;
	description: string;
	publishedDate: string;
	publishedBy: string;
	reportUrl: string;
}

export interface IInsightProps {
	id: string;
	imageUrl: string;
	tag: string; // "Idea of the Day"
	title: string; // "Malaysian Portfolios with US-China Trade Exposure"
	description: string; // đoạn mô tả ngắn
	date: string; // "25-Aug-2025"
}

// ============================================================================
// Profile API Types
// ============================================================================

// Trading Representative (TR) Info Types
export interface ITrInfo {
	trCode: string;
	trName: string;
	trContact: string;
	trEmail: string;
}

export type TrInfoResponse = ITrInfo;

// User Profile Types
export interface IUserProfile {
	profileId: string;
	domainId?: string;
	userCategoryId?: string;
	userId?: string;
	name?: string;
	email?: string;
	ic?: string;
	mobileNo?: string;
	mobileNoForSms?: string;
	homeNo?: string;
	officeNo?: string;
}

export type UserProfileResponse = IUserProfile;

export interface UserInfoResponse {
	userId: string;
	userName: string;
	userEmail: string;
	userMobile: string;
}

// Trading Account Types
export interface TradingAccount {
	accountNo: string;
	accountType?: PortfolioType;
	trName?: string;
	trCode?: string;
	eps?: string;
	giro?: string;
	cdp?: string;
	cpf?: string;
	cpfStatus?: "processing";
	srs?: string;
	srsStatus?: "processing";
	accreditedInvestor?: string;
}

// Alias for API responses (backwards compatibility)
export type UserAccountResponse = TradingAccount;

// BCAN Request Types
export interface CreateBcanRequest {
	accountNo: string;
}

export interface CreateBcanResponse {
	isSuccess: boolean;
}

// Donation Types
export interface IDonationPlan {
	id: number;
	currency: string;
	amount: number;
	start: string; // ISO date string
	end: string; // ISO date string
}

export type DonationPlanResponse = IDonationPlan;

export interface DonationSubmissionRequest {
	accountNo: string; // 7-digit, pattern: ^[0-9]{7}$
	amount?: number; // minimum: 0
	currency: string;
	paymentMethod: string; // pattern: ^(?i)(PLAN|LS_ACCSET)$
	paymentMode: string; // pattern: ^(?i)(DONATE)$
	months?: number; // 1-12
}

export interface DonationSubmissionResponse {
	isSuccess: boolean;
}

export interface DonationCancelRequest {
	id: number;
}

export interface DonationCancelResponse {
	isSuccess: boolean;
}

// Contact Us Types
export interface IContactUsClientService {
	operatingHours: string;
	callCentreNumber: string;
	callCentreEmailAddress: string;
	companyAddress: string;
}

export type ContactUsClientServiceResponse = IContactUsClientService;

export interface IContactUsCentralDealingDesk {
	operatingHours: string;
	centralDealingNumber: string;
	companyAddress: string;
}

export type ContactUsCentralDealingDeskResponse = IContactUsCentralDealingDesk;

// ============================================================================
// Subscription API Types
// ============================================================================

// Market Data Subscription Catalog Types (v4)
export interface IMarketSubscriptionItem {
	id: string;
	subscriptionModel: string; // "1"=one-time, "2"=time-based, "3"=variable
	duration: number;
	paymentType: string; // "1"=free, "2"=paid
	amount: number;
	gstIndicator: string; // "0"=NA, "1"=inclusive, "2"=no GST, "3"=apply
	professionalFlag: string | null; // "1"=Professional, "2"=Non-Professional, null=NA
	hasAgreement: string | null; // "Y" | "N" | null
}

export interface IMarketSubscriptionGroup {
	groupId: string;
	groupTitle: string;
	subscriptions: IMarketSubscriptionItem[];
}

export interface IMarketSubscriptionCatalog {
	research: IMarketSubscriptionGroup[];
	marketData: IMarketSubscriptionGroup[];
}

// Market Data Subscription Agreement Types (v4)
export interface ISubscriptionAgreement {
	subscriptionId: string;
	agreements: Array<{ agreementId: string; subject: string }>;
}

export interface ISubscriptionAgreementContent {
	htmlContent: string;
	url: string;
}

// Market Data Subscription Submission Types (v4)
export interface IMarketSubscriptionExtendedData {
	name: string;
	address: string;
	occupation: string;
	employer?: string;
	employerAddress?: string;
	employmentTitle?: string;
	employmentFunction?: string;
	value_01?: boolean;
	value_02?: boolean;
	value_03?: boolean;
	value_04?: boolean;
	value_05?: boolean;
	value_06?: boolean;
	value_07?: boolean;
	value_08?: boolean;
	value_09?: boolean;
	value_10?: boolean;
	value_11?: boolean;
}

export interface IMarketSubscriptionSubmitRequest {
	extendedData: IMarketSubscriptionExtendedData;
	subscriptionList: Array<{
		subscriptionId: string;
		acceptedAgreementIds?: string[];
	}>;
}

export interface IMarketSubscriptionSubmitResponse {
	isSuccess: boolean;
}

// User Market Data Subscription Types (v4)
export interface IUserMarketSubscription {
	groupId: string;
	groupTitle: string;
	groupType: string;
	subscriptionId: string;
	description: string;
	start: string; // ISO date
	end: string; // ISO date
	paymentStatus: string;
	allowRenew: boolean;
	isPromo: boolean;
}

// Product Subscription Types
export interface IProductSubscription {
	productCode: string;
	productName: string;
	productType: string;
	stockCode: string;
	exchangeCode: string;
	currency: string;
	issuePrice: number;
	minQty: number;
	startTime: string; // ISO 8601 date-time
	endTime: string; // ISO 8601 date-time
	isSubscribed: boolean;
}

export type ProductSubscriptionDto = IProductSubscription;

export interface ProductionSubscriptionListResponse {
	productSubs: ProductSubscriptionDto[];
}

// Product Subscription Detail Types
export interface IProductSubscriptionDetail {
	productCode: string;
	productName: string;
	productType: string;
	stockCode: string;
	exchangeCode: string;
	issuePrice: number;
	minQty: number;
	incrementQty: number;
	startTime: string; // ISO 8601 date-time
	endTime: string; // ISO 8601 date-time
	paymentDate: string; // ISO 8601 date-time
	listingDate: string; // ISO 8601 date-time
	baseCurrency?: string;
	tradingCurrency?: string;
	paymentMode?: string;
	excludedInvestment?: string;
	bannerUrl?: string;
	content1?: string;
	content2?: string;
	additionalInfo?: string;
	refDocs?: string;
	tncUrl?: string;
	brokerageFee?: number;
	minBrokerageFee?: number;
	transferFee?: number;
	managementFee?: number;
	conversionRate?: number;
	gst?: number;
	minPrice?: number;
	maxPrice?: number;
	aiOnly?: boolean;
	paymentAfterAllocation?: boolean;
	allocationDate?: string; // ISO 8601 date-time
	acknowledgementDate?: string; // ISO 8601 date-time
	issuePriceStatus?: boolean;
	allocationStatus?: boolean;
}

export type ProductSubscriptionDetailResponse = IProductSubscriptionDetail;

// User Product Subscription Types
export interface IUserProductSubscription {
	subscriptionId: string;
	productCode: string;
	productName: string;
	productType: string;
	stockCode: string;
	exchangeCode: string;
	currency: string;
	issuePrice: number;
	appliedQty?: number;
	allocatedQty?: number;
	endTime?: string; // ISO 8601 date-time
}

export type UserProductSubscriptionDto = IUserProductSubscription;

export interface UserProductSubsListResponse {
	userProductSubs: UserProductSubscriptionDto[];
}

// User Product Subscription Detail Types
export interface IUserProductSubscriptionDetail {
	subscriptionId?: string;
	productCode?: string;
	productName?: string;
	productType?: string;
	stockCode?: string;
	exchangeCode?: string;
	noteGenerateDate?: string; // ISO 8601 date-time
	clientName?: string;
	accountNo?: string;
	taxNoteNo?: string;
	applicationDate?: string; // ISO 8601 date-time
	paymentDueDate?: string; // ISO 8601 date-time
	amountPayable?: number;
	paymentCurrency?: string;
	baseCurrency?: string;
	totalUnit?: number;
	issuePrice?: number;
	grossProceed?: number;
	commission?: number;
	adminFee?: number;
	gstAmount?: number;
	gstPct?: number;
	conversionRate?: number;
}

export type UserProductSubscriptionDetailResponse = IUserProductSubscriptionDetail;

// User Product Subscription Submission Request
export interface UserProductSubscriptionSubmissionRequest {
	productCode: string; // maxLength: 32
	accountNo: string; // maxLength: 7
	totalUnit: number; // minimum: 1
	paymentCurrency: string; // maxLength: 10
	paymentMode: string; // maxLength: 200
}

// ============================================================================
// External SSO API Types
// ============================================================================

// NTP SSO Response
export interface NtpSSOResponse {
	postUrl: string;
	act: string;
	token: string;
	assertion: string;
	transactionId: string;
	page: string;
}

// Research Portal SSO Response
export interface ResearchSSOResponse {
	redirectUrl: string;
}

// Stock Filter SSO Response
export interface StockFilterSSOResponse {
	redirectUrl: string;
}

// Corporate Action SSO Response
export interface CorpActionSSOResponse {
	postUrl: string;
	samlResponse: string;
}

// eStatement SSO Response
export interface EStatementSSOResponse {
	redirectUrl: string;
}

// iScreener SSO Response (never implemented in iTrade Portal)
export interface IScreenerSSOResponse {
	redirectUrl: string;
}

// EW8 SSO Response
export interface EW8SSOResponse {
	redirectUrl: string;
}

// ECRS SSO Response
export interface ECRSSSOResponse {
	redirectUrl: string;
}

// ============================================================================
// Trading Info API Types (Trading Declarations)
// ============================================================================

// SIP (Sophisticated Investor Program) Info
export interface ITradingInfoSIP {
	toDisplay: boolean;
	passed: boolean;
	dueForSubmission: boolean;
	lastSubmissionID: string | null;
}

// W8-BEN Info
export interface ITradingInfoW8BEN {
	toDisplay: boolean;
	isJointAcct: boolean;
	expireDate: string | null;
}

// CRS Info
export interface ITradingInfoCRS {
	toDisplay: boolean;
	certified: boolean;
	isJointAcct: boolean;
	validationDate: string | null;
}

// BCAN Info
export interface ITradingInfoBCAN {
	toDisplay: boolean;
	requestStatus: string | null;
}

// Trading Info Response (GET /profile/api/v1/tradingInfo)
export interface TradingInfoResponse {
	sip: ITradingInfoSIP;
	w8ben: ITradingInfoW8BEN;
	crs: ITradingInfoCRS;
	bcan: ITradingInfoBCAN;
}

// ============================================================================
// Acknowledgement API Types
// ============================================================================

// Acknowledgement Item (individual agreement)
export interface IAcknowledgementItem {
	agreementId: string;
	title: string;
	versionNo: number;
	acceptedOn: string; // ISO date format (YYYY-MM-DD)
}

// User Acknowledgement List Response
export interface UserAcknowledgementListResponse {
	textBase: IAcknowledgementItem[];
	onlineBase: IAcknowledgementItem[];
	interactiveBase: IAcknowledgementItem[];
	pdfBase: IAcknowledgementItem[];
}

// Acknowledgement Detail Response
export interface AcknowledgementDetailResponse {
	title: string;
	versionNo: number;
	acceptedOn: string; // ISO date format
	htmlContent?: string;
	url?: string;
}

// ============================================================================
// Update Info API Types
// ============================================================================

// Mobile OTP Request/Response
export interface MobileOtpRequest {
	mobileNumber: string; // Pattern: ^(?=.{1,16}$)\+?\d{1,4}-\d+$
}

export interface MobileOtpResponse {
	transactionId: string;
}

// Email OTP Request/Response
export interface EmailOtpRequest {
	email: string; // maxLength: 64
}

export interface EmailOtpResponse {
	transactionId: string;
}

// Mobile/Email Submit Request/Response (shared)
export interface UpdateSubmitRequest {
	transactionId: string;
	otp: string; // Pattern: ^\d{6}$
}

export interface UpdateSubmitResponse {
	success: boolean;
}

// Signature Upload Response
export interface SignatureUploadResponse {
	transactionId: string;
}

// Signature Submit Request/Response
export interface SignatureSubmitRequest {
	transactionId: string;
}

export interface SignatureSubmitResponse {
	isSuccess: boolean;
}

// ============================================================================
// Portfolio API Types
// ============================================================================

export interface IExchangeRate {
	fromCurrency: string;
	toCurrency: string;
	bid: number;
	offer: number;
}

export interface ITrustBalance {
	currency: string;
	balance: number;
	lastUpdatedOn: string;
}

export interface ITrustBalanceDetail {
	accountNo: string;
	transactionNo: string;
	transactionDate: string;
	description: string;
	currency: string;
	quantity: number;
	tradedPrice: number;
	debit: number;
	credit: number;
	balance: number;
	accode: string;
}

export interface IPortfolioHolding {
	assetClass: string;
	marketCode: string;
	securityCode: string;
	securityName: string;
	totalQty: number;
	availQty?: number;
	earmarkQty?: number;
	currency: string;
	closingPrice: number;
	marketValue: number;
	capPrice?: number;
	capQty?: number;
	marginableQty?: number;
	valuationPct?: number;
	collateralValue?: number;
	pendingBuy?: number;
	pendingSell?: number;
	lastUpdatedOn: string;
}

export interface IContract {
	accountNo: string;
	traderCode: string;
	tradeDate: string;
	contractNo: string;
	type: string;
	securityName: string;
	tradedCurrency: string;
	price: number;
	quantity: number;
	settlementCurrency: string;
	netAmount: number;
	settlementDueDate: string;
	channel: string;
	remark: string;
	marketCode: string;
	baseNetAmt: number;
	lastUpdatedOn: string;
	paid: boolean;
}

export interface IContra {
	accountNo: string;
	traderCode: string;
	statementDate: string;
	statementNo: string;
	securityName: string;
	type: string;
	settlementCurrency: string;
	settlementNetAmount: number;
	marketCode: string;
	baseNetAmt: number;
	lastUpdatedOn: string;
	paid: boolean;
}

export interface IContraDetail {
	tradeDate: string;
	contractNo: string;
	securityName: string;
	settlementCurrency: string;
	settlementNetAmount: number;
}

export interface IBorrowedShare {
	assetClass: string;
	marketCode: string;
	securityCode: string;
	securityName: string;
	borrowedQty: number;
	pendingIn: number;
	pendingOut: number;
	currency: string;
	closingPrice: number;
	marketValue: number;
	lastUpdatedOn: string;
}

export interface ILoanedShare {
	assetClass: string;
	marketCode: string;
	securityCode: string;
	securityName: string;
	loanedQty: number;
	currency: string;
	closingPrice: number;
	lendingValue: number;
	lastUpdatedOn: string;
}

export interface IPaynowTopUp {
	accountNo: string;
	mode: string;
	amount: number;
	currency: string;
	refNo: string;
}

export interface IPaynowTopUpResponse {
	s2bPayUrl: string;
	corpId: string;
	encStr: string;
}

export interface ICDPTransferAccount {
	acctType: string;
	acctNo: string;
	trCode: string;
	trName: string;
}

export interface ICDPTransfer {
	name: string;
	nricPassport: string;
	cdpNo: string;
	accountList: ICDPTransferAccount[];
}

export interface ICDPTransferStatus {
	requestedOn: string;
	cdpNo: string;
	acctNo: string;
	status: string;
	statusDesc: string;
}
