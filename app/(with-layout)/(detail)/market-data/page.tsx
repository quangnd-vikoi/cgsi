"use client";

import { useState, useEffect, useCallback } from "react";
import Title from "@/components/Title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Boxes } from "lucide-react";
import NonProfessional from "./_components/NonProfessional";
import Professional from "./_components/Professional";
import CartStep from "./_components/CartStep";
import DeclarationStep from "./_components/DeclarationStep";
import NonProDeclarationStep from "./_components/NonProDeclarationStep";
import TermsStep from "./_components/TermsStep";
import SuccessState from "@/public/icons/success-state.svg";
import { getMarketDataCatalog, getMarketDataAgreements, getMarketDataAgreementContent, getMyMarketDataSubscriptions } from "@/lib/services/subscriptionService";
import type { IMarketSubscriptionCatalog, IMarketSubscriptionGroup, ISubscriptionAgreement, ISubscriptionAgreementContent, IMarketSubscriptionExtendedData } from "@/types";
import { useSheetStore } from "@/stores/sheetStore";

export type Step = "select" | "cart" | "declaration" | "non-pro-declaration" | "terms-and-conditions" | "success";

export interface IMarketDataItem {
    image: string;
    title: string;
    description?: string;
    subscriptionId?: string;
    selectedOption: {
        value: string;
        label: string;
    };
}

/**
 * Filter groups by professionalFlag on their subscriptions.
 * Keeps only subscriptions matching the flag, then drops empty groups.
 */
function filterByProfessional(
    groups: IMarketSubscriptionGroup[],
    professional: boolean
): IMarketSubscriptionGroup[] {
    return groups
        .map((group) => ({
            ...group,
            subscriptions: group.subscriptions.filter((sub) =>
                professional
                    ? sub.professionalFlag === "1"
                    : sub.professionalFlag !== "1"
            ),
        }))
        .filter((group) => group.subscriptions.length > 0);
}

const MarketData = () => {
    const [currentStep, setCurrentStep] = useState<Step>("select");
    const [selectedItems, setSelectedItems] = useState<IMarketDataItem[]>([]);
    const [catalog, setCatalog] = useState<IMarketSubscriptionCatalog | null>(null);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [catalogError, setCatalogError] = useState<string | null>(null);

    const loadCatalog = useCallback(async () => {
        try {
            setCatalogLoading(true);
            setCatalogError(null);
            const res = await getMarketDataCatalog();
            if (res.success && res.data) {
                setCatalog(res.data);
            } else {
                setCatalogError(res.error || "Failed to load subscriptions");
            }
        } catch {
            setCatalogError("Failed to load subscriptions");
        } finally {
            setCatalogLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCatalog();
    }, [loadCatalog]);

    // Pre-filter groups for each tab
    const nonProResearch = catalog ? filterByProfessional(catalog.research, false) : [];
    const nonProMarketData = catalog ? filterByProfessional(catalog.marketData, false) : [];
    const proResearch = catalog ? filterByProfessional(catalog.research, true) : [];
    const proMarketData = catalog ? filterByProfessional(catalog.marketData, true) : [];

    const [agreements, setAgreements] = useState<ISubscriptionAgreement[]>([]);
    const [agreementContents, setAgreementContents] = useState<Record<string, ISubscriptionAgreementContent>>({});
    const [extendedData, setExtendedData] = useState<IMarketSubscriptionExtendedData>({
        name: "", address: "", occupation: "",
    });
    const { setOpenSheet } = useSheetStore();

    const handleGoToCart = async () => {
        setCurrentStep("cart");

        const ids = selectedItems
            .map((item) => item.subscriptionId)
            .filter((id): id is string => !!id);

        if (ids.length > 0) {
            const res = await getMarketDataAgreements(ids);
            if (res.success && res.data) {
                setAgreements(res.data);

                // Fetch content for each agreementId
                const allAgreementIds = res.data.flatMap((s) =>
                    s.agreements.map((a) => a.agreementId)
                );
                if (allAgreementIds.length > 0) {
                    const contentResults = await Promise.all(
                        allAgreementIds.map((id) => getMarketDataAgreementContent(id))
                    );
                    const contents: Record<string, ISubscriptionAgreementContent> = {};
                    contentResults.forEach((contentRes, idx) => {
                        if (contentRes.success && contentRes.data) {
                            contents[allAgreementIds[idx]] = contentRes.data;
                        }
                    });
                    setAgreementContents(contents);
                }
            }
        }
    };

    const handleBack = () => {
        if (currentStep === "cart") {
            setCurrentStep("select");
        } else if (currentStep === "declaration" || currentStep === "non-pro-declaration") {
            setCurrentStep("cart");
        } else if (currentStep === "terms-and-conditions") {
            setCurrentStep("declaration");
        }
    };

    const calculateAmount = () => {
        return selectedItems.reduce((total, item) => {
            const price = Number(item.selectedOption?.value.split(" ")[0]);
            return total + (isNaN(price) ? 0 : price);
        }, 0);
    };
    return (
        <div className="max-w-[480px] w-full mx-auto flex-1 flex flex-col h-full">
            <div className="shrink-0">
                <Title
                    onBack={handleBack}
                    title={
                        currentStep === "select" || currentStep === "success"
                            ? "Market Data & Add-Ons"
                            : currentStep === "cart"
                                ? "Cart"
                                : currentStep === "declaration" || currentStep === "non-pro-declaration"
                                    ? "Declaration"
                                    : "Terms & Conditions"
                    }
                    rightContent={
                        currentStep === "select" ? (
                            <Button variant={"ghost"} className="border text-icon-light" onClick={() => setOpenSheet("my_subscriptions")}>
                                <Boxes /> My Subscriptions
                            </Button>
                        ) : null
                    }

                    showBackButton={currentStep !== "select" && currentStep !== "success"}
                />
            </div>

            {/* Step 1 - Selection */}
            {currentStep === "select" && (
                <div className="bg-white rounded-xl flex-1 flex flex-col overflow-hidden min-h-0">
                    <Tabs defaultValue="non-professional" className="flex flex-1 flex-col gap-0 min-h-0">
                        <div className="pad-x">
                            <TabsList className="w-full pt-6 shrink-0">
                                <TabsTrigger className="w-1/2 pb-2" value="non-professional">
                                    Non-Professional
                                </TabsTrigger>
                                <TabsTrigger className="w-1/2 pb-2" value="professional">
                                    Professional
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent
                            value="non-professional"
                            className="flex-1 overflow-y-auto sidebar-scroll sidebar-offset-2 m-0"
                        >
                            <NonProfessional
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                                researchGroups={nonProResearch}
                                marketDataGroups={nonProMarketData}
                                loading={catalogLoading}
                                error={catalogError}
                            />
                        </TabsContent>
                        <TabsContent
                            value="professional"
                            className="flex-1 overflow-y-auto sidebar-scroll sidebar-offset-2 m-0"
                        >
                            <Professional
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                                researchGroups={proResearch}
                                marketDataGroups={proMarketData}
                                loading={catalogLoading}
                                error={catalogError}
                            />
                        </TabsContent>
                    </Tabs>
                    <div className="px-6 py-4 border-t w-full flex justify-between relative gap-2">
                        <div>
                            <p className="text-base font-semibold">{calculateAmount()} SGD</p>
                            <p className="text-xs text-typo-tertiary">Excluding GST</p>
                        </div>
                        <Button className="text-base font-normal px-3 rounded" onClick={handleGoToCart}>
                            Go to Cart ({selectedItems.length})
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2 - Cart */}
            {currentStep === "cart" && (
                <CartStep
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    onCheckout={() => setCurrentStep("declaration")}
                />
            )}

            {/* Step 3 - Declaration */}
            {currentStep === "declaration" && (
                <DeclarationStep
                    extendedData={extendedData}
                    setExtendedData={setExtendedData}
                    onConfirm={() => setCurrentStep("non-pro-declaration")}
                />
            )}

            {currentStep === "non-pro-declaration" && (
                <NonProDeclarationStep
                    extendedData={extendedData}
                    setExtendedData={setExtendedData}
                    onConfirm={() => setCurrentStep("terms-and-conditions")}
                />
            )}

            {/* Step 4 - Terms & Conditions */}
            {currentStep === "terms-and-conditions" && (
                <TermsStep
                    setCurrenStep={setCurrentStep}
                    selectedItems={selectedItems}
                    agreements={agreements}
                    agreementContents={agreementContents}
                    extendedData={extendedData}
                />
            )}

            {/* Success */}
            {currentStep === "success" && (
                <div className="bg-white rounded flex-1 flex flex-col overflow-hidden min-h-0">
                    <div className="flex flex-col justify-center items-center py-5 md:py-7 h-full">
                        <SuccessState width={100} height={100} className="text-status-disable-primary" />

                        <div className="mt-6 font-semibold text-typo-primary text-base text-center leading-normal">
                            Subscription(s) Submitted
                        </div>

                        <div className="mt-1 font-normal text-typo-secondary text-sm text-center leading-tight px-5 md:w-2/3">
                            Settle the total amount due to enjoy your subscriptions!
                        </div>

                        <div className="mt-6 p-4 rounded bg-background-section flex justify-between items-center w-[calc(100%-48px)]">
                            <div>
                                <p className="text-sm font-semibold hidden md:block">Total Amount Due</p>
                                <p className="text-sm font-semibold md:hidden">Total Price</p>
                                <p className="text-xs">Inclusive of GST</p>
                            </div>
                            <p className="text-base font-semibold">54.50 SGD</p>
                        </div>
                    </div>
                    <div className="border-t px-6 py-4">
                        <Button onClick={() => setCurrentStep("select")} className="w-full rounded">
                            View My Subscriptions
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketData;