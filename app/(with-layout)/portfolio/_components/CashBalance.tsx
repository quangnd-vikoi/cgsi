"use client";

import React, { useState } from "react";
import { CircleFlag } from "react-circle-flags";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CirclePlus, FileText, EllipsisVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockCurrencyData } from "./data";
import Link from "next/link";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { PaymentModel } from "@/components/PaymentModel";

const INITIAL_DISPLAY_COUNT = 4;
const LOAD_MORE_COUNT = 10;


export const CashBalance = () => {
    const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handleShowMore = () => {
        setDisplayCount((prev) => Math.min(prev + LOAD_MORE_COUNT, mockCurrencyData.length));
    };

    const handleShowLess = () => {
        setDisplayCount(INITIAL_DISPLAY_COUNT);
    };

    const handleDepositClick = () => {
        setIsPaymentModalOpen(true);
    };

    const visibleCurrencies = mockCurrencyData.slice(0, displayCount);
    const hasMore = displayCount < mockCurrencyData.length;
    const canCollapse = displayCount > INITIAL_DISPLAY_COUNT;

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
                        <Button size="sm" className="text-sm rounded" onClick={handleDepositClick}>
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
                            <DropdownMenuItem onClick={handleDepositClick}>
                                <CirclePlus size={16} />
                                Deposit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="space-y-0">
                    <div className="grid grid-cols-2 py-2 text-xs text-typo-secondary">
                        <p className="">Currency</p>
                        <p className="text-right">Balance</p>
                    </div>

                    {visibleCurrencies.map((currency, index) => (
                        <div
                            key={currency.currencyCode}
                            className={`grid grid-cols-2 py-4 px-2 ${index < visibleCurrencies.length - 1 ? "border-b border-stroke-secondary" : ""
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <CircleFlag countryCode={currency.countryCode} className="w4 md:w-5 h-4 md:h-5 shrink-0" />
                                <p className="text-xs md:text-sm font-medium text-typo-primary">{currency.currencyName}</p>
                            </div>
                            <p className="text-xs md:text-sm font-medium text-typo-primary text-right">{currency.balance}</p>
                        </div>
                    ))}
                </div>

                {(hasMore || canCollapse) && (
                    <div className="mt-4 flex justify-center">
                        {hasMore ? (
                            <button
                                onClick={handleShowMore}
                                className="flex items-center gap-1 text-sm text-cgs-blue hover:text-cgs-blue/75"
                            >
                                Show others
                                <ChevronDown size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleShowLess}
                                className="flex items-center gap-1 text-sm text-cgs-blue hover:text-cgs-blue/75"
                            >
                                Show less
                                <ChevronUp size={16} />
                            </button>
                        )}
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
