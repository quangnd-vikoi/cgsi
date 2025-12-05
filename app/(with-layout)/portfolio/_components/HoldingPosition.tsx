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
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRightLeft, EllipsisVertical, Expand, FileOutput } from "lucide-react";
import { mockHoldingsData } from "./data";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

export const HoldingPosition = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(mockHoldingsData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = mockHoldingsData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    // Generate page numbers for pagination
    const generatePageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, "ellipsis", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "ellipsis", currentPage, "ellipsis", totalPages);
            }
        }

        return pages;
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
                            className="border border-enhanced-blue text-sm text-enhanced-blue rounded gap-2"
                        >
                            <FileOutput className="size-4" />
                            Export to Excel
                        </Button>
                        <Button
                            size="sm"
                            className="text-sm rounded gap-2 bg-enhanced-blue hover:bg-enhanced-blue/90"
                        >
                            <ArrowRightLeft className="size-4" />
                            SGX Shares Transfer
                        </Button>
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
                                <DropdownMenuItem>
                                    <ArrowRightLeft size={16} />
                                    SGX Shares Transfer
                                </DropdownMenuItem>
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
                <div className="flex flex-col gap-3 md:gap-4 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-stroke-secondary">
                    <div className="flex justify-between items-center">
                        <div className="text-xs md:text-sm text-typo-secondary shrink-0 w-[200px]">
                            Showing {startIndex + 1}-{Math.min(endIndex, mockHoldingsData.length)} out of {mockHoldingsData.length}
                        </div>

                        <Pagination className="w-fit m-0">
                            <PaginationContent className="gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        className={`size-7 md:size-9 p-0 ${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                                    />
                                </PaginationItem>

                                {generatePageNumbers().map((page, index) => (
                                    <PaginationItem className="hidden md:block" key={index}>
                                        {page === "ellipsis" ? (
                                            <PaginationEllipsis className="size-9" />
                                        ) : (
                                            <PaginationLink
                                                onClick={() => handlePageChange(page as number)}
                                                isActive={currentPage === page}
                                                className="cursor-pointer size-9 text-sm rounded"
                                            >
                                                {page}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        className={`size-7 md:size-9 p-0 ${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>

                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-sm text-typo-secondary whitespace-nowrap">
                                Items per page
                            </span>

                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={handleItemsPerPageChange}
                            >
                                <SelectTrigger className="!h-6 gap-1 px-2 !py-0 rounded border border-stroke-secondary !text-sm !w-fit">
                                    <SelectValue placeholder={itemsPerPage.toString()} />
                                </SelectTrigger>

                                <SelectContent className="min-w-[70px]">
                                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                                        <SelectItem key={option} value={option.toString()}>
                                            <p>
                                                {option.toString()}
                                            </p>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
