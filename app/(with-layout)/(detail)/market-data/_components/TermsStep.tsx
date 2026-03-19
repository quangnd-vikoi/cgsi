"use client";
import { Dispatch, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IMarketDataItem } from "../page";
import CartItemsList from "./CartItemList";
import { Step } from "../page";
import { toast } from "@/components/ui/toaster";
import TermsAndConditionsCheckbox from "@/components/TermsAndConditionsCheckbox";
import { submitMarketDataSubscription } from "@/lib/services/subscriptionService";
import type { ISubscriptionAgreement, ISubscriptionAgreementContent, IMarketSubscriptionExtendedData } from "@/types";

interface TermsStepProps {
    setCurrenStep: Dispatch<React.SetStateAction<Step>>;
    selectedItems: Array<IMarketDataItem>;
    agreements: ISubscriptionAgreement[];
    agreementContents: Record<string, ISubscriptionAgreementContent>;
    extendedData: IMarketSubscriptionExtendedData;
}

const TermsStep = ({ setCurrenStep, selectedItems, agreements, agreementContents, extendedData }: TermsStepProps) => {
    const [agreed, setAgreed] = useState(false);
    const [showTermsError, setShowTermsError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [dialogAgreement, setDialogAgreement] = useState<{ agreementId: string; subject: string } | null>(null);

    // Flatten all agreements from all subscriptions
    const allAgreements = agreements.flatMap((s) =>
        s.agreements.map((a) => ({
            ...a,
            subscriptionId: s.subscriptionId,
        }))
    );

    const handleTermConfirm = async () => {
        if (!agreed) {
            setShowTermsError(true);
            return;
        }

        setSubmitting(true);

        try {
            // Build subscription list with accepted agreement IDs
            const subscriptionList = selectedItems
                .filter((item) => item.subscriptionId)
                .map((item) => {
                    const subAgreement = agreements.find(
                        (a) => a.subscriptionId === item.subscriptionId
                    );
                    return {
                        subscriptionId: item.subscriptionId!,
                        acceptedAgreementIds: subAgreement
                            ? subAgreement.agreements.map((a) => a.agreementId)
                            : [],
                    };
                });

            const res = await submitMarketDataSubscription({
                extendedData,
                subscriptionList,
            });

            if (res.success) {
                setCurrenStep("success");
                toast.success("Subscription Submitted",
                    "Your market data subscription has been submitted successfully.",
                );
            } else {
                toast.error("Submission Failed",
                    res.error || "Failed to submit subscription. Please try again.",
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

                {allAgreements.length > 0 ? (
                    <div className="border border-stroke-secondary rounded">
                        {allAgreements.map((agreement, idx) => (
                            <div key={agreement.agreementId}>
                                {idx > 0 && <Separator />}
                                <button
                                    type="button"
                                    className="w-full flex justify-between items-center p-4 cursor-pointer"
                                    onClick={() => setDialogAgreement(agreement)}
                                >
                                    <p className="text-sm text-left">{agreement.subject}</p>
                                    <ChevronRight size={16} className="text-cgs-blue shrink-0" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-typo-tertiary">No agreements required.</p>
                )}

                <Separator className="my-6" />

                {/* Subscription Summary */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">
                        Subscription Summary
                    </h2>
                    <CartItemsList showRemove={false} selectedItems={selectedItems} onRemoveItem={() => { }} />
                </div>
            </div>

            {/* Action Buttons */}
            <div>
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
                        {submitting ? <Loader2 className="animate-spin" /> : "Continue"}
                    </Button>
                </div>
            </div>

            {/* Agreement Content Dialog */}
            <Dialog open={!!dialogAgreement} onOpenChange={(open) => !open && setDialogAgreement(null)}>
                <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0 gap-0">
                    <DialogHeader className="flex-shrink-0 p-4 md:p-6 pb-3 md:pb-3">
                        <DialogTitle className="text-base md:text-lg font-semibold text-typo-primary pr-8">
                            {dialogAgreement?.subject}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-0 md:pt-0">
                        {dialogAgreement && agreementContents[dialogAgreement.agreementId]?.htmlContent ? (
                            <div
                                className="text-sm text-typo-secondary prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: agreementContents[dialogAgreement.agreementId].htmlContent,
                                }}
                            />
                        ) : dialogAgreement && agreementContents[dialogAgreement.agreementId]?.url ? (
                            <a
                                href={agreementContents[dialogAgreement.agreementId].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-cgs-blue underline"
                            >
                                View Agreement
                            </a>
                        ) : (
                            <p className="text-sm text-typo-tertiary">
                                No content available
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TermsStep;
