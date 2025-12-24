"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRightLeft, EllipsisVertical, Expand, FileOutput } from "lucide-react";
import { PaginationFooter } from "@/components/PaginationFooter";
import { mockHoldingsData } from "./data";
import { PortfolioType } from "../page";
import { INTERNAL_ROUTES } from "@/constants/routes";
import Link from "next/link";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

export const HoldingPosition = ({ type }: { type: PortfolioType }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = mockHoldingsData.slice(startIndex, endIndex);

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <div className="bg-white rounded-lg border border-stroke-secondary">
            <div className="pad-x py-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-typo-primary">Holdings &amp; Positions</h2>
                    </div>

                    {/* Desktop: Show buttons */}
                    <div className="hidden md:flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border border-enhanced-blue text-sm text-enhanced-blue rounded gap-2 hover:bg-transparent hover:border-enhanced-blue/75 hover:text-enhanced-blue/75"
                        >
                            <FileOutput className="size-4" />
                            Export to Excel
                        </Button>
                        {type === "CTA" && (
                            <Link href={INTERNAL_ROUTES.SHARE_TRANSFER}>
                                <Button
                                    size="sm"
                                    className="text-sm rounded gap-2 bg-enhanced-blue hover:bg-enhanced-blue/90"
                                >
                                    <ArrowRightLeft className="size-4" />
                                    SGX Shares Transfer
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile: Show dropdown menu */}
                    <div className="flex gap-4 items-center md:hidden">
                        <Button variant="ghost" size="icon" className="size-4 md:hidden">
                            <Expand size={16} />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-5">
                                    <EllipsisVertical size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem>
                                    <FileOutput size={16} />
                                    Export to Excel
                                </DropdownMenuItem>
                                {type === "CTA" && (
                                    <DropdownMenuItem>
                                        <ArrowRightLeft size={16} />
                                        SGX Shares Transfer
                                    </DropdownMenuItem>)}

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto  rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-background-section border-b border-stroke-secondary [&>th]:text-xs [&>th]:font-semibold [&>th]:text-typo-primary [&>th]:whitespace-nowrap [&>th]:!px-4 [&>th]:py-3 md:[&>th]:px-2">
                                <TableHead>Asset Class</TableHead>
                                <TableHead>Market</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Total Qty</TableHead>
                                <TableHead className="text-right">Earmarked</TableHead>
                                <TableHead className="text-right">Avail Qty</TableHead>
                                <TableHead className="text-right">Currency</TableHead>
                                <TableHead className="text-right">Closing Price</TableHead>
                                <TableHead className="text-right">Market Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.map((item, index) => (
                                <TableRow
                                    key={`${item.code}-${index}`}
                                    className="border-b border-stroke-secondary last:border-0 hover:bg-background-section/50 [&>td]:text-sm [&>td]:text-typo-primary [&>td]:whitespace-nowrap [&>td]:!px-4 [&>td]:py-3 md:[&>td]:px-2"
                                >
                                    <TableCell>{item.assetClass}</TableCell>
                                    <TableCell>{item.market}</TableCell>
                                    <TableCell>{item.code}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-right">{item.totalQty}</TableCell>
                                    <TableCell className="text-right">{item.earmarked}</TableCell>
                                    <TableCell className="text-right">{item.availQty}</TableCell>
                                    <TableCell className="text-right">{item.currency}</TableCell>
                                    <TableCell className="text-right">
                                        {item.closingPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell className="font-medium text-right">
                                        {item.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Footer */}
                <PaginationFooter
                    currentPage={currentPage}
                    totalItems={mockHoldingsData.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
                    className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-stroke-secondary"
                />
            </div>
        </div>
    );
};
