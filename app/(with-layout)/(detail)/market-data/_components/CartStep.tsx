import { Button } from "@/components/ui/button";
import { IMarketDataItem } from "../page";
import { Dispatch, SetStateAction } from "react";
import { ErrorState } from "@/components/ErrorState";
import Alert from "@/components/Alert";
import { toast } from "@/components/ui/toaster";
import CartItemsList from "./CartItemList";

interface CartStepProps {
    selectedItems: Array<IMarketDataItem>;
    setSelectedItems: Dispatch<SetStateAction<Array<IMarketDataItem>>>;
    onCheckout: () => void;
}


const CartStep = ({ selectedItems, setSelectedItems, onCheckout }: CartStepProps) => {

    const handleRemoveAllItems = () => {
        setSelectedItems([])
        toast.success("All Items Removed", "All items have been successfully removed from your cart.")
    };

    const handleRemoveOneItem = (item: IMarketDataItem) => {
        setSelectedItems(prev => prev.filter(i => i.title !== item.title))
        toast.success("Item Removed", "The selected item has been removed from your cart")
    };
    return (
        <div className="bg-white rounded-lg flex-1 flex flex-col overflow-hidden min-h-0">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto sidebar-scroll sidebar-offset-2 pad-x py-6">
                <p className="text-typo-primary text-base font-semibold">Subscription Items</p>
                {
                    selectedItems.length === 0 ? (
                        <div className="h-[calc(100%-100px)]">
                            <ErrorState title="Your cart is empty" description="Go back and browse our subscriptions to continue!" type="empty" />
                        </div>
                    ) :
                        <CartItemsList showRemove={true} selectedItems={selectedItems} onRemoveItem={handleRemoveOneItem} />
                }
            </div>

            {/* Summary */}
            <div className="border-t pad-x py-4 justify-end flex gap-2">
                <Alert
                    trigger={
                        <Button disabled={selectedItems.length === 0} variant="outline" className="px-3 border-none text-cgs-blue hover:text-cgs-blue/75 shadow-none hover:bg-transparent disabled:text-status-disable-primary">
                            Remove All
                        </Button>
                    }
                    title="Remove All Items"
                    description={<p className="text-base text-typo-secondary">Are you sure you wish to remove all the items in your cart?</p>}
                    actionText="Confirm"
                    onAction={handleRemoveAllItems}
                />
                <Button onClick={onCheckout} className="px-3 rounded">
                    Continue ({selectedItems.length})
                </Button>
            </div>
        </div>
    );
};

export default CartStep;