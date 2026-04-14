import { X } from "lucide-react";
import Image from "@/components/Image";
import SubscriptionThumbnail from "@/components/SubscriptionThumbnail";
import { Separator } from "@/components/ui/separator";
import { ErrorState } from "@/components/ErrorState";
import Alert from "@/components/Alert";
import { toast } from "@/components/ui/toaster";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IMarketDataItem } from "../page";

interface CartItemsListProps {
    selectedItems: Array<IMarketDataItem>;
    onRemoveItem?: (item: IMarketDataItem) => void;
    showRemove?: boolean; // ⬅️ page khác có thể tắt
}

const CartItemsList = ({ selectedItems, onRemoveItem, showRemove = true }: CartItemsListProps) => {

    const handleRemoveOneItem = (item: IMarketDataItem) => {
        onRemoveItem?.(item);
        toast.success("Item Removed", "The selected item has been removed from your cart");
    };

    const subTotal = selectedItems.reduce((total, item) => {
        const value = parseFloat(item.selectedOption.value);
        return total + (isNaN(value) ? 0 : value);
    }, 0).toFixed(2);

    const gst = selectedItems.reduce((total, item) => {
        if (item.gstIndicator !== "3") return total;
        const value = parseFloat(item.selectedOption.value);
        return total + (isNaN(value) ? 0 : value * 0.09);
    }, 0).toFixed(2);

    const getDurationLabel = (item: IMarketDataItem) => {
        if (item.selectedOption.label === "Free" && item.selectedOption.value === "Free") {
            return "-";
        }

        return item.selectedOption.label;
    };

    if (selectedItems.length === 0) {
        return (
            <div className="h-[calc(100%-100px)]">
                <ErrorState
                    title="Your cart is empty"
                    description="Go back and browse our subscriptions to continue!"
                    type="empty"
                />
            </div>
        );
    }

    return (
        <div>
            {/* ITEMS */}
            <div className="space-y-4 mt-6 border border-stroke-secondary rounded p-4">
                {selectedItems.map((item, index) => (
                    <div key={index}>
                        <div className="flex gap-4 py-3">
                            <SubscriptionThumbnail src={item.image} alt={item.title} />

                            <div className="flex-1 space-y-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="text-typo-primary text-sm md:text-base font-medium flex-1 line-clamp-2 leading-tight break-words">
                                        {item.title}
                                    </p>

                                    {showRemove && (
                                        <Alert
                                            trigger={
                                                <X
                                                    className="cursor-pointer text-typo-tertiary hover:text-typo-tertiary/75 shrink-0"
                                                    size={20}
                                                />
                                            }
                                            title="Remove Item"
                                            description={
                                                <p className="text-base text-typo-secondary">
                                                    Remove &quot;{item.title} ({item.selectedOption.label})&quot;?
                                                </p>
                                            }
                                            actionText="Confirm"
                                            onAction={() => handleRemoveOneItem(item)}
                                        />
                                    )}
                                </div>

                                <div className="flex justify-between text-sm">
                                    <p className="text-typo-secondary">{getDurationLabel(item)}</p>
                                    <p className="text-typo-primary font-semibold">{item.selectedOption.value}</p>
                                </div>
                            </div>
                        </div>

                        {index !== selectedItems.length - 1 && <Separator className="my-3" />}
                    </div>
                ))}
            </div>

            {/* TOTAL SUMMARY */}
            <div className="mt-4 rounded p-4 bg-background-section text-sm text-typo-secondary">
                <div className="flex justify-between">
                    <p>Sub-Total</p>
                    <p className="font-semibold text-typo-primary">{subTotal} SGD</p>
                </div>

                <div className="flex justify-between mt-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-1 cursor-help"
                                aria-label="GST information"
                            >
                                <span>GST</span>
                                <Image
                                    src="/icons/Warning.svg"
                                    alt="GST information"
                                    width={14}
                                    height={14}
                                />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            className="w-64 translate-x-0"
                            arrowClassName="translate-x-0"
                        >
                            <p>The current Goods and Services Tax (GST) rate in Singapore is at 9%</p>
                        </TooltipContent>
                    </Tooltip>
                    <p className="font-semibold text-typo-primary">{gst} SGD</p>
                </div>

                <Separator className="my-4 border-stroke-secondary" />

                <div className="mt-4 flex justify-between items-center">
                    <div>
                        <p className="text-sm md:text-base font-semibold text-typo-primary">Total price</p>
                        <p className="text-xs md:text-sm">Inclusive of GST</p>
                    </div>

                    <p className="text-base md:text-lg text-typo-primary font-semibold">
                        {(Number(subTotal) + Number(gst)).toFixed(2)} SGD
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartItemsList;
