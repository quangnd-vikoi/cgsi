"use client";
import { Dispatch, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { IMarketDataItem } from "../page";
import CartItemsList from "./CartItemList";
import { Step } from "../page";
import { subscriptionService } from "@/lib/services/subscriptionService";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { toast } from "@/components/ui/toaster";
import TermsAndConditionsCheckbox from "@/components/TermsAndConditionsCheckbox";

interface TermsStepProps {
    setCurrenStep: Dispatch<React.SetStateAction<Step>>;
    selectedItems: Array<IMarketDataItem>;
}

const TermsStep = ({ setCurrenStep, selectedItems }: TermsStepProps) => {
    const [agreed, setAgreed] = useState(false);
    const [showTermsError, setShowTermsError] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const selectedAccount = useTradingAccountStore(
        (state) => state.selectedAccount
    );

    const handleTermConfirm = async () => {
        if (!agreed) {
            setShowTermsError(true);
            return;
        }

        setSubmitting(true);

        try {
            // NOTE: Using product subscription endpoint as workaround
            // TODO: Request proper market data submission endpoint from backend
            // Expected endpoint: POST /subscription/api/v1/marketDataSubscription

            const submissions = selectedItems.map((item) =>
                subscriptionService.submitProductSubscription({
                    productCode: item.title, // Using title as productCode (workaround)
                    accountNo: selectedAccount?.accountNo || "",
                    totalUnit: 1,
                    paymentCurrency: "SGD",
                    paymentMode: "PayNow",
                })
            );

            const results = await Promise.allSettled(submissions);
            const allSucceeded = results.every(
                (r) => r.status === "fulfilled" && r.value.success
            );

            if (allSucceeded) {
                setCurrenStep("success");
                toast.success("Subscription Submitted",
                    "Your market data subscription has been submitted successfully.",
                );
            } else {
                const failedCount = results.filter(
                    (r) => r.status === "rejected" || !r.value.success
                ).length;

                toast.error("Submission Failed",
                    `${failedCount} subscription(s) failed. Please try again.`,
                );
            }
        } catch (error) {
            console.error("Market data subscription error:", error);
            toast.error("Error",
                "Failed to submit subscription. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="bg-white rounded flex-1 flex flex-col overflow-hidden min-h-0">
            <div className="flex-1 py-6 pad-x overflow-y-auto sidebar-scroll sidebar-offset-2">
                <h2 className="text-lg font-semibold mb-2">
                    Terms & Conditions
                </h2>

                {/* Terms & Conditions */}

                <div className="border border-stroke-secondary p-4 rounded">
                    <div className="flex justify-between items-center">
                        <p className="text-sm">General T&C</p>
                        <ChevronRight size={16} className="text-cgs-blue cursor-pointer shrink-0" />
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center">
                        <p className="text-sm">SGX L2 Market Depth Campaign T&C</p>
                        <ChevronRight size={16} className="text-cgs-blue cursor-pointer shrink-0" />
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center">
                        <p className="text-sm">US Real-Time Market Data Online Agreement</p>
                        <ChevronRight size={16} className="text-cgs-blue cursor-pointer shrink-0" />
                    </div>
                </div>

                <Separator className="my-6" />

                {/* Subscription */}
                <div>

                    <h2 className="text-lg font-semibold mb-2">
                        Subscription Summary
                    </h2>
                    <CartItemsList showRemove={false} selectedItems={selectedItems} onRemoveItem={() => { }} />
                </div>



            </div>

            {/* Action Buttons */}
            <div className="">
                <TermsAndConditionsCheckbox
                    id="terms"
                    checked={agreed}
                    onCheckedChange={(checked) => {
                        setAgreed(checked);
                        if (checked) setShowTermsError(false);
                    }}
                    showError={showTermsError}
                    labelText="I declare that I have fully read and understood all the Terms & Conditions above"
                    showLink={false}
                    className="pad-x py-6 border-y border-stroke-secondary"
                />
                <div className="pad-x py-6">

                    <Button
                        onClick={handleTermConfirm}
                        className="w-full rounded"
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Continue"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TermsStep;