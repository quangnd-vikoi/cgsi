export interface INotification {
	id: string; // Required for mark as read functionality
	title: string;
	description: string;
	category: string; // Notification category for filtering/grouping
	status: "R" | "U"; // "R" = Read, "U" = Unread
	createdOn: string; // ISO 8601 date-time format
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

// Trading Account Types
export interface TradingAccount {
	accountNo: string;
	accountType?: string;
	trName?: string;
	trCode?: string;
	eps?: string;
	giro?: string;
	cdp?: string;
	cpf?: string;
	srs?: string;
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

// Market Data Subscription Types (from YAML)
export interface ISubscription {
	id: string;
	category: string;
	description: string;
	amount: number;
	needDeclaration: boolean;
}

export type SubscriptionResponse = ISubscription;

// User Market Data Subscription Types (from YAML)
export interface IUserSubscription {
	subscriptionId: string;
	category: string;
	description: string;
	start: string; // ISO date
	end: string; // ISO date
	paymentStatus: string;
	allowRenew: boolean;
}

export type UserSubscriptionResponse = IUserSubscription;

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
	togaToken: string;
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
	isPassed: boolean;
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
	isSuccess: boolean;
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
