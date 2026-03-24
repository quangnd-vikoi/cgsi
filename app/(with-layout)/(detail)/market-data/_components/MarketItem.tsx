"use client"
import React, { useState } from 'react'
import SubscriptionThumbnail from '@/components/SubscriptionThumbnail'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectTrigger,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { IMarketDataItem } from '../page';

interface DropDownItem {
    id?: string;
    label: string;
    value: string;
}

interface MarketItemProps {
    title: string;
    description: string;
    image: string;
    dropDownItems?: DropDownItem[];
    defaultSelected?: DropDownItem | null;
    onSelectItem?: (selectedItem: IMarketDataItem) => void;
    freeOnly?: boolean;
    freeSubscriptionId?: string; // subscription ID for free-only groups
}

const MarketItem = ({ title, image, description, dropDownItems, defaultSelected, onSelectItem, freeOnly, freeSubscriptionId }: MarketItemProps) => {
    const [selectedItem, setSelectedItem] = useState<DropDownItem | null>(defaultSelected ?? null);
    const [tempItem, setTempItem] = useState<DropDownItem | null>(null);
    const [open, setOpen] = useState(false);

    // Free-only mode: card is directly clickable, no dropdown
    if (freeOnly) {
        const isSelected = !!defaultSelected;

        const handleToggle = () => {
            if (!onSelectItem) return;
            onSelectItem({
                image,
                title,
                subscriptionId: freeSubscriptionId,
                selectedOption: {
                    value: "Free",
                    label: "Free",
                },
            });
        };

        return (
            <button
                type="button"
                onClick={handleToggle}
                className={cn(
                    'w-full flex justify-between items-center border p-4 rounded cursor-pointer py-4',
                    isSelected ? 'bg-background-selected border-cgs-blue' : 'border-stroke-secondary'
                )}
            >
                <div className="flex gap-4 w-full overflow-hidden">
                    <SubscriptionThumbnail src={image} alt={title} />
                    <div className="text-left min-w-0 flex-1">
                        <p className="text-sm font-semibold text-typo-primary truncate">{title}</p>
                        <p className={cn('text-xs mt-1', isSelected ? 'text-cgs-blue' : 'text-status-success')}>
                            {isSelected ? description : 'Free'}
                        </p>
                    </div>
                </div>
            </button>
        );
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setTempItem(selectedItem);
        } else {
            setTempItem(null);
        }
    };

    const handleItemChange = (value: string) => {
        const item = dropDownItems?.find(item => item.value === value);
        if (item) {
            setTempItem(item);
        }
    };

    const handleAddToCart = () => {
        if (tempItem) {
            setSelectedItem(tempItem);
            if (onSelectItem) {
                onSelectItem({
                    image,
                    title,
                    subscriptionId: tempItem.id,
                    selectedOption: {
                        value: tempItem.value,
                        label: tempItem.label,
                    },
                });
            }
        }
        setOpen(false);
    };

    return (
        <Select open={open} onOpenChange={handleOpenChange}>
            <SelectTrigger className={cn('w-full flex justify-between items-center border border-stroke-secondary p-4 rounded group cursor-pointer py-4 !h-auto', selectedItem ? 'bg-background-selected hover:bg-background-selected border-cgs-blue' : '')}>
                <div className="flex gap-4 w-full overflow-hidden">
                    <SubscriptionThumbnail src={image} alt={title} />

                    <div className="text-left min-w-0 flex-1">
                        <p className="text-sm font-semibold text-typo-primary truncate">{title}</p>
                        <p className={cn('text-xs mt-1 text-typo-secondary', selectedItem ? 'text-cgs-blue' : description === 'Free' ? 'text-status-success' : '')}>
                            {selectedItem ? `${selectedItem.label}` : description}
                        </p>
                    </div>
                </div>
            </SelectTrigger>
            <SelectContent>
                <RadioGroup value={tempItem?.value || ''} onValueChange={handleItemChange}>
                    <SelectGroup className='pt-2'>
                        {dropDownItems?.map((item, index) => (
                            <label
                                key={index}
                                htmlFor={`radio-${index}`}
                                className="relative flex w-full cursor-pointer select-none items-center hover:bg-background-selected px-3 py-2.5 text-sm"
                            >
                                <div className="flex w-full justify-between items-center gap-4">
                                    <p className="text-sm">
                                        {item.label}
                                    </p>
                                    <div className='flex items-center gap-2 shrink-0'>
                                        <p className="text-sm font-medium">
                                            {item.value}
                                        </p>
                                        <RadioGroupItem
                                            id={`radio-${index}`}
                                            value={item.value}
                                        />
                                    </div>
                                </div>
                            </label>
                        ))}
                    </SelectGroup>
                </RadioGroup>

                <div className="py-4 px-2 bg-background-section flex justify-end">
                    <Button
                        onClick={handleAddToCart}
                        disabled={!tempItem}
                        className="w-fit py-1.5 px-3 disabled:bg-status-disable-primary disabled:text-theme-neutral-095 font-normal rounded"
                    >
                        Add to Cart
                    </Button>
                </div>
            </SelectContent>
        </Select>
    )
}

export default MarketItem
