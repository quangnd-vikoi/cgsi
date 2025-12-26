"use client";

import React from "react";
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

interface PaginationFooterProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (value: number) => void;
    itemsPerPageOptions?: number[];
    showItemsPerPage?: boolean;
    maxVisiblePages?: number;
    className?: string;
}

export const PaginationFooter = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [10, 20, 50],
    showItemsPerPage = true,
    maxVisiblePages = 5,
    className = "",
}: PaginationFooterProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Generate page numbers for pagination
    const generatePageNumbers = (): (number | "ellipsis")[] => {
        const pages: (number | "ellipsis")[] = [];

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

    const handleItemsPerPageChange = (value: string) => {
        if (onItemsPerPageChange) {
            onItemsPerPageChange(Number(value));
        }
    };

    return (
        <div className={`flex flex-col gap-3 md:gap-4 ${className}`}>
            <div className="flex justify-between items-center">
                {/* Items count */}
                <div className="text-xs md:text-sm text-typo-secondary shrink-0 w-[200px]">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} out of {totalItems}
                </div>

                {/* Pagination controls */}
                <Pagination className="w-fit m-0">
                    <PaginationContent className="gap-1">
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                                className={`size-7 md:size-9 p-0 ${
                                    currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }`}
                            />
                        </PaginationItem>

                        {generatePageNumbers().map((page, index) => (
                            <PaginationItem className="hidden md:block" key={index}>
                                {page === "ellipsis" ? (
                                    <PaginationEllipsis className="size-9" />
                                ) : (
                                    <PaginationLink
                                        onClick={() => onPageChange(page as number)}
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
                                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                                className={`size-7 md:size-9 p-0 ${
                                    currentPage === totalPages
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }`}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

                {/* Items per page selector */}
                {showItemsPerPage && onItemsPerPageChange && (
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
                                {itemsPerPageOptions.map((option) => (
                                    <SelectItem key={option} value={option.toString()}>
                                        <p>{option.toString()}</p>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
        </div>
    );
};
