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
import { useSheetStore } from "@/stores/sheetStore";
import { CGSI } from "@/constants/routes";

interface TermsStepProps {
    setCurrenStep: Dispatch<React.SetStateAction<Step>>;
    selectedItems: Array<IMarketDataItem>;
    agreements: ISubscriptionAgreement[];
    agreementContents: Record<string, ISubscriptionAgreementContent>;
    extendedData: IMarketSubscriptionExtendedData;
    needsDeclaration: boolean;
}

const TEXT_FIELD_MAP: Record<string, keyof IMarketSubscriptionExtendedData> = {
    SUBSCRIBER_NAME: "name",
    SUBSCRIBER_ADDRESS: "address",
    SUBSCRIBER_OCCUPATION: "occupation",
    EMPLOYER_NAME: "employer",
    EMPLOYER_ADDRESS: "employerAddress",
    EMPLOYMENT_TITLE: "employmentTitle",
    EMPLOYMENT_FUNCTION: "employmentFunction",
};

/**
 * Inject extendedData values into agreement HTML form fields:
 * - Text inputs (SUBSCRIBER_NAME, SUBSCRIBER_ADDRESS, etc.)
 * - Radio buttons (ANSWER_VALUE_01 through ANSWER_VALUE_11)
 * - Checkboxes (SECTION_CHECK_01, SECTION_CHECK_02)
 */
function injectFormValues(html: string, data: IMarketSubscriptionExtendedData): string {
    let result = html;

    // Inject text input values
    for (const [inputName, dataKey] of Object.entries(TEXT_FIELD_MAP)) {
        const value = (data[dataKey] as string) ?? "";
        // Match <INPUT ... name=FIELD_NAME ...> (with or without quotes/closing slash)
        const regex = new RegExp(
            `(<INPUT\\b[^>]*\\bname=["']?${inputName}["']?[^>]*?)(/?>)`,
            "gi"
        );
        result = result.replace(regex, (_match, before, close) => {
            // Remove any existing value attribute
            const cleaned = before.replace(/\s+value=["'][^"']*["']/gi, "");
            return `${cleaned} value="${value.replace(/"/g, "&quot;")}"${close}`;
        });
    }

    // Inject radio button selections (ANSWER_VALUE_01 through ANSWER_VALUE_11)
    for (let i = 1; i <= 11; i++) {
        const num = String(i).padStart(2, "0");
        const key = `value_${num}` as keyof IMarketSubscriptionExtendedData;
        const selected = data[key] as boolean | undefined;

        // Match both radio buttons for this question (value=true and value=false)
        const radioRegex = new RegExp(
            `(<INPUT\\b[^>]*\\bname=["']?ANSWER_VALUE_${num}["']?[^>]*?)(/?>)`,
            "gi"
        );
        result = result.replace(radioRegex, (_match, before, close) => {
            // Remove existing CHECKED attribute
            let cleaned = before.replace(/\s+CHECKED\b/gi, "");
            // Check if this radio's value matches the selected value
            const valueMatch = before.match(/\bvalue=["']?(true|false)["']?/i);
            if (valueMatch) {
                const radioValue = valueMatch[1].toLowerCase() === "true";
                if (radioValue === selected) {
                    cleaned += " CHECKED";
                }
            }
            return `${cleaned}${close}`;
        });
    }

    // Check the section checkboxes (SECTION_CHECK_01, SECTION_CHECK_02)
    const checkboxRegex = /(<INPUT\b[^>]*\bname=["']?SECTION_CHECK_\d+["']?[^>]*?)(\/?>)/gi;
    result = result.replace(checkboxRegex, (_match, before, close) => {
        let cleaned = before.replace(/\s+checked\b/gi, "");
        return `${cleaned} checked${close}`;
    });

    return result;
}

const TermsStep = ({ setCurrenStep, selectedItems, agreements, agreementContents, extendedData, needsDeclaration }: TermsStepProps) => {
    const [agreed, setAgreed] = useState(false);
    const [showTermsError, setShowTermsError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [dialogAgreement, setDialogAgreement] = useState<{ agreementId: string; subject: string } | null>(null);
    const { setOpenSheet } = useSheetStore();

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

        if (needsDeclaration) {
            const { name, address, occupation, employer, employerAddress } = extendedData;
            const missingDeclaration = !name?.trim() || !address?.trim() || !occupation?.trim() ||
                !employer?.trim() || !employerAddress?.trim();
            if (missingDeclaration) {
                toast.error("Declaration Incomplete",
                    "Please complete the declaration form before submitting.",
                );
                return;
            }
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
                toast.error("Submission Unsuccessful",
                    res.error || "We were unable to process your subscription at this time. Please try again later.",
                );
            }
        } catch (error) {
            console.error("Market data subscription error:", error);
            toast.error("Something Went Wrong",
                "We encountered an unexpected issue while processing your request. Please try again later.",
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

                <div className="border border-stroke-secondary rounded">
                    <a
                        href={CGSI.GENERAL_TNC}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex justify-between items-center p-4 cursor-pointer"
                    >
                        <p className="text-sm text-left">General Terms & Conditions</p>
                        <ChevronRight size={16} className="text-cgs-blue shrink-0" />
                    </a>
                    {allAgreements.map((agreement) => (
                        <div key={agreement.agreementId}>
                            <Separator />
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
                <div className="pad-x py-4">
                    <Button
                        onClick={handleTermConfirm}
                        className="w-full rounded text-sm md:text-base"
                        disabled={submitting}
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : "Subscribe"}
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
                                    __html: needsDeclaration
                                        ? injectFormValues(agreementContents[dialogAgreement.agreementId].htmlContent, extendedData)
                                        : agreementContents[dialogAgreement.agreementId].htmlContent,
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
