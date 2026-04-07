"use client";

import React, { useState, useEffect } from "react";
import { CircleFlag } from "react-circle-flags";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CirclePlus, FileText, EllipsisVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { PaymentModel } from "@/components/PaymentModel";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { getTrustBalance, getFxRates } from "@/lib/services/portfolioService";
import type { ITrustBalance, IExchangeRate } from "@/types";

const INITIAL_DISPLAY_COUNT = 4;

const CURRENCIES: { currency: string; name: string; countryCode: string }[] = [
    { currency: "SGD", name: "Singapore Dollars", countryCode: "sg" },
    { currency: "MYR", name: "Malaysian Ringgits", countryCode: "my" },
    { currency: "HKD", name: "Hongkong Dollars", countryCode: "hk" },
    { currency: "USD", name: "United States Dollars", countryCode: "us" },
    { currency: "CNY", name: "Chinese Yuan", countryCode: "cn" },
    { currency: "JPY", name: "Japanese Yen", countryCode: "jp" },
    { currency: "AUD", name: "Australian Dollar", countryCode: "au" },
    { currency: "EUR", name: "Euro", countryCode: "eu" },
    { currency: "GBP", name: "Pound Sterling", countryCode: "gb" },
];

export const CashBalance = () => {
    const [showOthers, setShowOthers] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [apiBalances, setApiBalances] = useState<ITrustBalance[]>([]);
    const [fxRates, setFxRates] = useState<IExchangeRate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { selectedAccount } = useTradingAccountStore();

    useEffect(() => {
        const fetchBalances = async () => {
            if (!selectedAccount?.accountNo) return;
            setIsLoading(true);
            setApiBalances([]);
            const [balanceRes, fxRes] = await Promise.all([
                getTrustBalance(selectedAccount.accountNo),
                getFxRates(),
            ]);
            if (balanceRes.success && balanceRes.data) setApiBalances(balanceRes.data);
            if (fxRes.success && fxRes.data) setFxRates(fxRes.data);
            setIsLoading(false);
        };
        fetchBalances();
    }, [selectedAccount?.accountNo]);

    const toSGD = (currency: string, balance: number) => {
        if (currency === "SGD") return balance;
        const rate = fxRates.find((r) => r.fromCurrency === currency && r.toCurrency === "SGD");
        return rate ? balance * Number(rate.bid) : 0;
    };

    // Merge API data, then sort: nonzero first (desc by SGD equivalent), then zeros
    const balances = CURRENCIES.map((c) => {
        const found = apiBalances.find((b) => b.currency === c.currency);
        return { ...c, balance: found?.balance ?? 0 };
    }).sort((a, b) => {
        const sgdA = toSGD(a.currency, a.balance);
        const sgdB = toSGD(b.currency, b.balance);
        if (sgdA > 0 && sgdB === 0) return -1;
        if (sgdA === 0 && sgdB > 0) return 1;
        return sgdB - sgdA;
    });

    const topBalances = balances.slice(0, INITIAL_DISPLAY_COUNT);
    const otherBalances = balances.slice(INITIAL_DISPLAY_COUNT);
    const hasOthers = otherBalances.length > 0;

    return (
        <div className="bg-white rounded border border-stroke-secondary">
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-base font-bold text-typo-primary">Cash Balance</h2>

                    {/* Desktop: Show buttons */}
                    <div className="hidden md:flex gap-4">
                        <Link href={INTERNAL_ROUTES.CASH_TRANSACTION}>
                            <Button variant="outline" size="sm" className="border border-cgs-blue text-sm text-cgs-blue rounded hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75">
                                <FileText size={16} />
                                Cash Transactions
                            </Button>
                        </Link>
                        <Button size="sm" className="text-sm rounded" onClick={() => setIsPaymentModalOpen(true)}>
                            <CirclePlus size={16} />
                            Deposit
                        </Button>
                    </div>

                    {/* Mobile: Show dropdown menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <EllipsisVertical size={20} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link href={INTERNAL_ROUTES.CASH_TRANSACTION} className="flex items-center gap-2">
                                    <FileText size={16} />
                                    Cash Transactions
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsPaymentModalOpen(true)}>
                                <CirclePlus size={16} />
                                Deposit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="space-y-0">
                    <div className="grid grid-cols-2 py-2 text-xs text-typo-secondary">
                        <p>Currency</p>
                        <p className="text-right">Balance</p>
                    </div>

                    {isLoading ? (
                        Array.from({ length: INITIAL_DISPLAY_COUNT }).map((_, i) => (
                            <div key={i} className={`grid grid-cols-2 py-4 px-2 ${i < INITIAL_DISPLAY_COUNT - 1 ? "border-b border-stroke-secondary" : ""}`}>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 md:w-5 h-4 md:h-5 rounded-full bg-gray-200 animate-pulse shrink-0" />
                                    <div className="h-3.5 w-32 bg-gray-200 animate-pulse rounded" />
                                </div>
                                <div className="flex justify-end">
                                    <div className="h-3.5 w-24 bg-gray-200 animate-pulse rounded" />
                                </div>
                            </div>
                        ))
                    ) : topBalances.map((item, index) => (
                        <div
                            key={item.currency}
                            className={`grid grid-cols-2 py-4 px-2 ${index < topBalances.length - 1 || (showOthers && hasOthers) ? "border-b border-stroke-secondary" : ""}`}
                        >
                            <div className="flex items-center gap-2">
                                <CircleFlag countryCode={item.countryCode} className="w-4 md:w-5 h-4 md:h-5 shrink-0" />
                                <p className="text-xs md:text-sm font-medium text-typo-primary">{item.name}</p>
                            </div>
                            <p className="text-xs md:text-sm font-medium text-typo-primary text-right">
                                {(item.balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {item.currency}
                            </p>
                        </div>
                    ))}

                    {!isLoading && showOthers && otherBalances.map((item, index) => (
                        <div
                            key={item.currency}
                            className={`grid grid-cols-2 py-4 px-2 ${index < otherBalances.length - 1 ? "border-b border-stroke-secondary" : ""}`}
                        >
                            <div className="flex items-center gap-2">
                                <CircleFlag countryCode={item.countryCode} className="w-4 md:w-5 h-4 md:h-5 shrink-0" />
                                <p className="text-xs md:text-sm font-medium text-typo-primary">{item.name}</p>
                            </div>
                            <p className="text-xs md:text-sm font-medium text-typo-primary text-right">
                                {(item.balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {item.currency}
                            </p>
                        </div>
                    ))}
                </div>

                {!isLoading && hasOthers && (
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => setShowOthers((prev) => !prev)}
                            className="flex items-center gap-1 text-sm text-cgs-blue hover:text-cgs-blue/75"
                        >
                            {showOthers ? (
                                <>Show less <ChevronUp size={16} /></>
                            ) : (
                                <>Show others <ChevronDown size={16} /></>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <PaymentModel
                open={isPaymentModalOpen}
                onOpenChange={setIsPaymentModalOpen}
            />
        </div>
    );
};
