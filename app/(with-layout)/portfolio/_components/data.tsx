// Mock data for Portfolio components

export interface HoldingData {
    assetClass: string;
    market: string;
    code: string;
    name: string;
    totalQty: number;
    earmarked: number;
    availQty: number;
    currency: string;
    closingPrice: number;
    marketValue: number;
}

export interface CurrencyBalance {
    currencyCode: string;
    currencyName: string;
    balance: string;
    countryCode: string; // ISO 3166-1 alpha-2 country code for flag
}

// Contract interface for Outstanding Payments (Settle) page
export interface Contract {
    id: string;
    contractId: string;
    status: "Overdue" | "Outstanding";
    tradeDate: string;
    dueDate: string;
    settlementCcy: string;
    gainLoss: number;
    side: "Buy" | "Sell";
    market: string;
    code: string;
}

// Holdings & Positions mock data
const generateHoldingsData = (): HoldingData[] => {
    const companies = [
        { code: "AAPL", name: "Apple Inc.", market: "HK", currency: "HKD", price: 2250.00 },
        { code: "MSFT", name: "Microsoft Corporation", market: "HK", currency: "HKD", price: 1150.00 },
        { code: "GOOGL", name: "Alphabet Inc.", market: "HK", currency: "HKD", price: 3000.00 },
        { code: "AMZN", name: "Amazon.com, Inc.", market: "SG", currency: "SGD", price: 4500.00 },
        { code: "TSLA", name: "Tesla, Inc.", market: "SG", currency: "SGD", price: 2800.00 },
        { code: "NFLX", name: "Netflix, Inc.", market: "SG", currency: "SGD", price: 2100.00 },
        { code: "META", name: "Meta Platforms, Inc.", market: "SG", currency: "SGD", price: 3200.00 },
        { code: "NVDA", name: "NVIDIA Corporation", market: "US", currency: "USD", price: 6500.00 },
        { code: "DIS", name: "The Walt Disney Company", market: "US", currency: "USD", price: 5000.00 },
        { code: "ADBE", name: "Adobe Inc.", market: "US", currency: "USD", price: 1800.00 },
    ];

    const data: HoldingData[] = [];
    for (let i = 0; i < 100; i++) {
        const company = companies[i % companies.length];
        const totalQty = [20, 40, 25, 50, 60, 30, 37, 70, 80, 45][i % 10];
        const earmarked = i % 3 === 0 ? 32 : 0;

        data.push({
            assetClass: "Equities",
            market: company.market,
            code: company.code,
            name: company.name,
            totalQty,
            earmarked,
            availQty: totalQty - earmarked,
            currency: company.currency,
            closingPrice: company.price,
            marketValue: totalQty * company.price,
        });
    }
    return data;
};

export const mockHoldingsData = generateHoldingsData();

// Cash Balance mock data
export const mockCurrencyData: CurrencyBalance[] = [
    { currencyCode: "SGD", currencyName: "Singapore Dollars", balance: "100,000.00 SGD", countryCode: "sg" },
    { currencyCode: "HKD", currencyName: "Hong Kong Dollars", balance: "2,300.00 HKD", countryCode: "hk" },
    { currencyCode: "USD", currencyName: "United States Dollars", balance: "900,000.00 USD", countryCode: "us" },
    { currencyCode: "GBP", currencyName: "British Pound Sterling", balance: "220.00 GBP", countryCode: "gb" },
    { currencyCode: "EUR", currencyName: "Euro", balance: "15,000.00 EUR", countryCode: "eu" },
    { currencyCode: "JPY", currencyName: "Japanese Yen", balance: "1,500,000 JPY", countryCode: "jp" },
    { currencyCode: "AUD", currencyName: "Australian Dollars", balance: "45,000.00 AUD", countryCode: "au" },
    { currencyCode: "CAD", currencyName: "Canadian Dollars", balance: "32,000.00 CAD", countryCode: "ca" },
    { currencyCode: "CHF", currencyName: "Swiss Franc", balance: "8,500.00 CHF", countryCode: "ch" },
    { currencyCode: "CNY", currencyName: "Chinese Yuan", balance: "250,000.00 CNY", countryCode: "cn" },
    { currencyCode: "NZD", currencyName: "New Zealand Dollars", balance: "18,000.00 NZD", countryCode: "nz" },
    { currencyCode: "SEK", currencyName: "Swedish Krona", balance: "95,000.00 SEK", countryCode: "se" },
    { currencyCode: "KRW", currencyName: "South Korean Won", balance: "12,000,000 KRW", countryCode: "kr" },
    { currencyCode: "NOK", currencyName: "Norwegian Krone", balance: "85,000.00 NOK", countryCode: "no" },
    { currencyCode: "DKK", currencyName: "Danish Krone", balance: "72,000.00 DKK", countryCode: "dk" },
    { currencyCode: "MYR", currencyName: "Malaysian Ringgit", balance: "125,000.00 MYR", countryCode: "my" },
    { currencyCode: "THB", currencyName: "Thai Baht", balance: "350,000.00 THB", countryCode: "th" },
    { currencyCode: "PHP", currencyName: "Philippine Peso", balance: "450,000.00 PHP", countryCode: "ph" },
    { currencyCode: "IDR", currencyName: "Indonesian Rupiah", balance: "15,000,000 IDR", countryCode: "id" },
    { currencyCode: "INR", currencyName: "Indian Rupee", balance: "850,000.00 INR", countryCode: "in" },
];

// Generate contracts mock data for Settle page
const generateContracts = (): Contract[] => {
    const contracts: Contract[] = [
        {
            id: "1",
            contractId: "199324823/I",
            status: "Overdue",
            tradeDate: "11-Jun-2025",
            dueDate: "13-Jun-2025",
            settlementCcy: "HKD",
            gainLoss: -968.0,
            side: "Buy",
            market: "HKSE",
            code: "AAPL",
        },
        {
            id: "2",
            contractId: "192353523/I",
            status: "Outstanding",
            tradeDate: "12-Jun-2025",
            dueDate: "14-Jun-2025",
            settlementCcy: "HKD",
            gainLoss: 1020.0,
            side: "Sell",
            market: "SGX",
            code: "MSFT",
        },
        {
            id: "3",
            contractId: "205423875/I",
            status: "Outstanding",
            tradeDate: "13-Jun-2025",
            dueDate: "15-Jun-2025",
            settlementCcy: "HKD",
            gainLoss: 1500.0,
            side: "Sell",
            market: "US",
            code: "GOOGL",
        },
        {
            id: "4",
            contractId: "214567890/I",
            status: "Outstanding",
            tradeDate: "14-Jun-2025",
            dueDate: "16-Jun-2025",
            settlementCcy: "SGD",
            gainLoss: -2300.0,
            side: "Buy",
            market: "BURSA",
            code: "AMZN",
        },
        {
            id: "5",
            contractId: "225678901/I",
            status: "Outstanding",
            tradeDate: "15-Jun-2025",
            dueDate: "17-Jun-2025",
            settlementCcy: "SGD",
            gainLoss: 2800.0,
            side: "Sell",
            market: "BURSA",
            code: "TSLA",
        },
        {
            id: "6",
            contractId: "236789012/I",
            status: "Outstanding",
            tradeDate: "16-Jun-2025",
            dueDate: "18-Jun-2025",
            settlementCcy: "SGD",
            gainLoss: -1200.0,
            side: "Buy",
            market: "US",
            code: "NFLX",
        },
        {
            id: "7",
            contractId: "247890123/I",
            status: "Outstanding",
            tradeDate: "17-Jun-2025",
            dueDate: "19-Jun-2025",
            settlementCcy: "SGD",
            gainLoss: 2000.0,
            side: "Sell",
            market: "US",
            code: "META",
        },
        {
            id: "8",
            contractId: "258901234/I",
            status: "Outstanding",
            tradeDate: "18-Jun-2025",
            dueDate: "20-Jun-2025",
            settlementCcy: "USD",
            gainLoss: -1750.0,
            side: "Buy",
            market: "SET",
            code: "NVDA",
        },
        {
            id: "9",
            contractId: "269012345/I",
            status: "Outstanding",
            tradeDate: "19-Jun-2025",
            dueDate: "21-Jun-2025",
            settlementCcy: "USD",
            gainLoss: 1400.0,
            side: "Sell",
            market: "IDX",
            code: "DIS",
        },
        {
            id: "10",
            contractId: "270123456/I",
            status: "Outstanding",
            tradeDate: "20-Jun-2025",
            dueDate: "22-Jun-2025",
            settlementCcy: "USD",
            gainLoss: 900.0,
            side: "Sell",
            market: "SHANGHAI",
            code: "ADBE",
        },
    ];

    // Generate more data for pagination testing
    const moreContracts: Contract[] = [];
    for (let i = 11; i <= 15; i++) {
        moreContracts.push({
            ...contracts[i % 10],
            id: i.toString(),
            contractId: `${280000000 + i}/I`,
        });
    }

    return [...contracts, ...moreContracts];
};

export const mockContracts = generateContracts();

// Cash Transaction interface
export interface CashTransaction {
    id: string;
    transactionId: string;
    transactionDate: string;
    description: string;
    currency: string;
    tradedPrice: number;
    quantity: number;
    amount: number;
}

// Generate cash transactions mock data
const generateCashTransactions = (): CashTransaction[] => {
    const transactions: CashTransaction[] = [
        {
            id: "1",
            transactionId: "697678545",
            transactionDate: "12-Jun-2025",
            description: "Donation for Charity",
            currency: "SGD",
            tradedPrice: 0.000,
            quantity: 0,
            amount: -10.00,
        },
        {
            id: "2",
            transactionId: "697678546",
            transactionDate: "13-Jun-2025",
            description: "CASH STT BUY 25000 SGSIIC EN",
            currency: "JPY",
            tradedPrice: 150.000,
            quantity: 15,
            amount: -2250.00,
        },
        {
            id: "3",
            transactionId: "697678554",
            transactionDate: "18-Jun-2025",
            description: "CASH STT SELL 2000 SG UMS INTE",
            currency: "CAD",
            tradedPrice: 450.000,
            quantity: 40,
            amount: 750.00,
        },
        {
            id: "4",
            transactionId: "697678547",
            transactionDate: "14-Jun-2025",
            description: "CASH STT BUY 3000 HK HAIER SMA",
            currency: "USD",
            tradedPrice: 300.000,
            quantity: 30,
            amount: -12000.00,
        },
        {
            id: "5",
            transactionId: "697678548",
            transactionDate: "19-Jun-2025",
            description: "CASH STT SELL 5000 HK SUNLIGH",
            currency: "GBP",
            tradedPrice: 350.000,
            quantity: 35,
            amount: 3000.00,
        },
        {
            id: "6",
            transactionId: "697678549",
            transactionDate: "15-Jun-2025",
            description: "CASH STT BUY 16200 SG AIMS APA",
            currency: "CHF",
            tradedPrice: 250.000,
            quantity: 10,
            amount: -2500.00,
        },
        {
            id: "7",
            transactionId: "697678550",
            transactionDate: "20-Jun-2025",
            description: "CASH STT SELL 500 SG JARDINE CY",
            currency: "NZD",
            tradedPrice: 500.000,
            quantity: 50,
            amount: 500.00,
        },
        {
            id: "8",
            transactionId: "697678551",
            transactionDate: "16-Jun-2025",
            description: "CASH STT BUY 15000 SG RIVERSTO",
            currency: "EUR",
            tradedPrice: 100.000,
            quantity: 25,
            amount: 2500.00,
        },
        {
            id: "9",
            transactionId: "697678552",
            transactionDate: "21-Jun-2025",
            description: "CASH STT SELL 7500 SG FIRST RES",
            currency: "CNY",
            tradedPrice: 600.000,
            quantity: 5,
            amount: 1000.00,
        },
        {
            id: "10",
            transactionId: "697678553",
            transactionDate: "17-Jun-2025",
            description: "CASH STT BUY 4800 SG SINGAPOR...",
            currency: "AUD",
            tradedPrice: 400.000,
            quantity: 12,
            amount: -8000.00,
        },
    ];

    // Generate more transactions for pagination testing
    const moreTransactions: CashTransaction[] = [];
    for (let i = 11; i <= 55; i++) {
        const baseTransaction = transactions[(i - 1) % 10];
        moreTransactions.push({
            ...baseTransaction,
            id: i.toString(),
            transactionId: `${697678500 + i}`,
        });
    }

    return [...transactions, ...moreTransactions];
};

export const mockCashTransactions = generateCashTransactions();

// Borrowed Shares interface
export interface BorrowedShareData {
    assetClass: string;
    market: string;
    code: string;
    name: string;
    borrowedQty: number;
    pendIn: number;
    pendOut: number;
    netQty: number;
    currency: string;
    closingPrice: number;
    borrowValue: number;
}

// Loaned Shares interface
export interface LoanedShareData {
    assetClass: string;
    market: string;
    code: string;
    name: string;
    loanedQty: number;
    currency: string;
    closingPrice: number;
    lendingValue: number;
}

// Generate Borrowed Shares mock data
const generateBorrowedSharesData = (): BorrowedShareData[] => {
    const companies = [
        { code: "AAPL", name: "Apple Inc.", market: "HK", currency: "HKD", price: 2250.00 },
        { code: "MSFT", name: "Microsoft Corporation", market: "HK", currency: "HKD", price: 1150.00 },
        { code: "GOOGL", name: "Alphabet Inc.", market: "HK", currency: "HKD", price: 3000.00 },
        { code: "AMZN", name: "Amazon.com, Inc.", market: "SG", currency: "SGD", price: 4500.00 },
        { code: "TSLA", name: "Tesla, Inc.", market: "SG", currency: "SGD", price: 2800.00 },
        { code: "NFLX", name: "Netflix, Inc.", market: "SG", currency: "SGD", price: 2100.00 },
        { code: "META", name: "Meta Platforms, Inc.", market: "SG", currency: "SGD", price: 3200.00 },
        { code: "NVDA", name: "NVIDIA Corporation", market: "US", currency: "USD", price: 6500.00 },
        { code: "DIS", name: "The Walt Disney Company", market: "US", currency: "USD", price: 5000.00 },
        { code: "ADBE", name: "Adobe Inc.", market: "US", currency: "USD", price: 1800.00 },
    ];

    const data: BorrowedShareData[] = [];
    for (let i = 0; i < 100; i++) {
        const company = companies[i % companies.length];
        const borrowedQty = [20, 40, 25, 50, 60, 30, 37, 70, 80, 45][i % 10];
        const pendIn = 0;
        const pendOut = i % 5 === 0 ? 32 : 0;
        const netQty = borrowedQty + pendIn - pendOut;

        data.push({
            assetClass: "Equities",
            market: company.market,
            code: company.code,
            name: company.name,
            borrowedQty,
            pendIn,
            pendOut,
            netQty,
            currency: company.currency,
            closingPrice: company.price,
            borrowValue: netQty * company.price,
        });
    }
    return data;
};

export const mockBorrowedSharesData = generateBorrowedSharesData();

// Generate Loaned Shares mock data
const generateLoanedSharesData = (): LoanedShareData[] => {
    const companies = [
        { code: "AAPL", name: "Apple Inc.", market: "HK", currency: "HKD", price: 2250.00 },
        { code: "MSFT", name: "Microsoft Corporation", market: "HK", currency: "HKD", price: 1150.00 },
        { code: "GOOGL", name: "Alphabet Inc.", market: "HK", currency: "HKD", price: 3000.00 },
        { code: "AMZN", name: "Amazon.com, Inc.", market: "SG", currency: "SGD", price: 4500.00 },
        { code: "TSLA", name: "Tesla, Inc.", market: "SG", currency: "SGD", price: 2800.00 },
        { code: "NFLX", name: "Netflix, Inc.", market: "SG", currency: "SGD", price: 2100.00 },
        { code: "META", name: "Meta Platforms, Inc.", market: "SG", currency: "SGD", price: 3200.00 },
        { code: "NVDA", name: "NVIDIA Corporation", market: "US", currency: "USD", price: 6500.00 },
        { code: "DIS", name: "The Walt Disney Company", market: "US", currency: "USD", price: 5000.00 },
        { code: "ADBE", name: "Adobe Inc.", market: "US", currency: "USD", price: 1800.00 },
    ];

    const data: LoanedShareData[] = [];
    for (let i = 0; i < 100; i++) {
        const company = companies[i % companies.length];
        const loanedQty = [20, 40, 25, 50, 60, 30, 37, 70, 80, 45][i % 10];

        data.push({
            assetClass: "Equities",
            market: company.market,
            code: company.code,
            name: company.name,
            loanedQty,
            currency: company.currency,
            closingPrice: company.price,
            lendingValue: loanedQty * company.price,
        });
    }
    return data;
};

export const mockLoanedSharesData = generateLoanedSharesData();
