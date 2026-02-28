"use client";
import { Dispatch, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CartItemsList from "./CartItemList";
import { Step } from "../page";
import { subscriptionService } from "@/lib/services/subscriptionService";
import { toast } from "@/components/ui/toaster";
import TermsAndConditionsCheckbox from "@/components/TermsAndConditionsCheckbox";
import type {
    ISelectedMarketSubscription,
    ISubscriptionAgreement,
    IMarketSubscriptionExtendedData,
} from "@/types";

interface TermsStepProps {
    setCurrenStep: Dispatch<React.SetStateAction<Step>>;
    selectedItems: Array<ISelectedMarketSubscription>;
    declarationData: Partial<IMarketSubscriptionExtendedData> | null;
}

const TermsStep = ({ setCurrenStep, selectedItems, declarationData }: TermsStepProps) => {
    const [agreed, setAgreed] = useState(false);
    const [showTermsError, setShowTermsError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [agreements, setAgreements] = useState<ISubscriptionAgreement[]>([]);

    useEffect(() => {
        const idsWithAgreement = selectedItems
            .filter(item => item.hasAgreement === "Y")
            .map(item => item.subscriptionId);

        if (idsWithAgreement.length > 0) {
            subscriptionService.getMarketDataAgreements(idsWithAgreement).then(res => {
                if (res.success && res.data) {
                    setAgreements(res.data);
                }
            });
        }
    }, [selectedItems]);

    const handleViewAgreement = async (agreementId: string) => {
        const res = await subscriptionService.getMarketDataAgreementContent(agreementId);
        if (res.success && res.data) {
            const newWindow = window.open("", "_blank");
            if (newWindow) {
                newWindow.document.write(res.data.htmlContent);
                newWindow.document.close();
            }
        }
    };

    const handleTermConfirm = async () => {
        if (!agreed) {
            setShowTermsError(true);
            return;
        }

        setSubmitting(true);

        try {
            const acceptedAgreementIds = agreements.map(a => a.agreementId);

            const result = await subscriptionService.submitMarketDataSubscription({
                subscriptionList: selectedItems.map(item => ({
                    subscriptionId: item.subscriptionId,
                    acceptedAgreementIds,
                })),
                extendedData: declarationData || undefined,
            });

            if (result.success && result.data?.isSuccess) {
                setCurrenStep("success");
                toast.success("Subscription Submitted",
                    "Your market data subscription has been submitted successfully.",
                );
            } else {
                toast.error("Submission Failed",
                    "Failed to submit subscription. Please try again.",
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
                {agreements.length > 0 && (
                    <div className="border border-stroke-secondary p-4 rounded">
                        {agreements.map((agreement, index) => (
                            <div key={agreement.agreementId}>
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => handleViewAgreement(agreement.agreementId)}
                                >
                                    <p className="text-sm">{agreement.title}</p>
                                    <ChevronRight size={16} className="text-cgs-blue shrink-0" />
                                </div>
                                {index !== agreements.length - 1 && <Separator className="my-4" />}
                            </div>
                        ))}
                    </div>
                )}

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
