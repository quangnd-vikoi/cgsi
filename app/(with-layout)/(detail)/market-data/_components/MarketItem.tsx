"use client"
import Image from '@/components/Image'
import React, { useState } from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectTrigger,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import type { IMarketSubscriptionItem, ISelectedMarketSubscription } from '@/types';

interface MarketItemProps {
    groupId: string;
    groupTitle: string;
    description: string;
    image: string;
    subscriptions: IMarketSubscriptionItem[];
    onSelectItem?: (selectedItem: ISelectedMarketSubscription) => void;
}

const MarketItem = ({ groupId, groupTitle, image, description, subscriptions, onSelectItem }: MarketItemProps) => {
    const [selectedSub, setSelectedSub] = useState<IMarketSubscriptionItem | null>(null);
    const [tempSub, setTempSub] = useState<IMarketSubscriptionItem | null>(null);
    const [open, setOpen] = useState(false);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setTempSub(selectedSub);
        } else {
            setTempSub(null);
        }
    };

    const handleItemChange = (value: string) => {
        const sub = subscriptions.find(s => s.id === value);
        if (sub) {
            setTempSub(sub);
        }
    };

    const handleAddToCart = () => {
        if (tempSub) {
            setSelectedSub(tempSub);
            onSelectItem?.({
                subscriptionId: tempSub.id,
                groupId,
                groupTitle,
                duration: tempSub.duration,
                amount: tempSub.amount,
                gstIndicator: tempSub.gstIndicator,
                hasAgreement: tempSub.hasAgreement,
                paymentType: tempSub.paymentType,
            });
        }
        setOpen(false);
    };

    const formatDuration = (duration: number) =>
        `${duration} Month${duration > 1 ? 's' : ''}`;

    return (
        <Select open={open} onOpenChange={handleOpenChange}>
            <SelectTrigger className={cn('w-full flex justify-between items-center border border-stroke-secondary p-4 rounded group cursor-pointer py-4 !h-auto', selectedSub ? 'bg-background-selected border-cgs-blue' : '')}>
                <div className="flex gap-4 w-full overflow-hidden">
                    <div className="shrink-0">
                        <Image src={image} alt={groupTitle} width={44} height={44} />
                    </div>

                    <div className="text-left min-w-0 flex-1">
                        <p className="text-sm font-semibold text-typo-primary truncate">{groupTitle}</p>
                        <p className={cn('text-xs mt-1 text-typo-secondary', selectedSub ? 'text-cgs-blue' : '')}>
                            {selectedSub ? formatDuration(selectedSub.duration) : description}
                        </p>
                    </div>
                </div>
            </SelectTrigger>
            <SelectContent>
                <RadioGroup value={tempSub?.id || ''} onValueChange={handleItemChange}>
                    <SelectGroup className='pt-2'>
                        {subscriptions.map((sub, index) => (
                            <label
                                key={sub.id}
                                htmlFor={`radio-${index}`}
                                className="relative flex w-full cursor-pointer select-none items-center hover:bg-background-selected px-3 py-2.5 text-sm"
                            >
                                <div className="flex w-full justify-between items-center gap-4">
                                    <p className="text-sm">
                                        {formatDuration(sub.duration)}
                                    </p>
                                    <div className='flex items-center gap-2 shrink-0'>
                                        <p className="text-sm font-medium">
                                            {sub.amount.toFixed(2)} SGD
                                        </p>
                                        <RadioGroupItem
                                            id={`radio-${index}`}
                                            value={sub.id}
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
                        disabled={!tempSub}
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
