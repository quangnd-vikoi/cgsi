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
