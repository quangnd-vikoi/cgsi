import { X } from "lucide-react";
import Image from "@/components/Image";
import { Separator } from "@/components/ui/separator";
import { ErrorState } from "@/components/ErrorState";
import Alert from "@/components/Alert";
import { toast } from "@/components/ui/toaster";
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
        const value = parseFloat(item.selectedOption.value.replace("SGD ", ""));
        return total + value;
    }, 0).toFixed(2);

    const gst = selectedItems.reduce((total, item) => {
        const value = parseFloat(item.selectedOption.value.replace("SGD ", ""));
        return total + value * 0.09;
    }, 0).toFixed(2);

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
                            <div className="w-[44px] h-[44px] shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={44}
                                    height={44}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-typo-primary text-sm font-medium flex-1">
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
                                    <p className="text-typo-secondary">{item.selectedOption.label}</p>
                                    <p className="text-typo-primary font-semibold">{item.selectedOption.value}</p>
                                </div>
                            </div>
                        </div>

                        {index !== selectedItems.length - 1 && <Separator className="my-3" />}
                    </div>
                ))}
            </div>

            {/* TOTAL SUMMARY */}
            <div className="mt-6 rounded p-4 bg-background-section text-sm text-typo-secondary">
                <div className="flex justify-between">
                    <p>Sub-Total</p>
                    <p className="font-semibold text-typo-primary">{subTotal} SGD</p>
                </div>

                <div className="flex justify-between mt-2">
                    <div className="flex gap-1 items-center">
                        <p>GST</p>
                        <Image src="/icons/Warning.svg" alt="Warning" width={14} height={14} />
                    </div>
                    <p className="font-semibold text-typo-primary">{gst} SGD</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-typo-primary">Total price</p>
                        <p className="text-xs">Inclusive of GST</p>
                    </div>

                    <p className="text-base text-typo-primary font-semibold">
                        {(Number(subTotal) + Number(gst)).toFixed(2)} SGD
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartItemsList;
