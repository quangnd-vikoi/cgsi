"use client"
import { useState } from "react";
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
import {
    getUserSubscriptionDetails,
    getProductSubscriptionsByType,
    getProductDetails
} from "@/lib/services/subscriptionService";
import { toast } from "sonner";

export type Step = "select" | "cart" | "professional-declaration" | "non-professional-declaration" | "terms-and-conditions" | "success";

export interface IMarketDataItem {
    image: string,
    title: string
    description?: string,
    selectedOption: {
        value: string;
        label: string;
    }
}
const MarketData = () => {
    const [currentStep, setCurrentStep] = useState<Step>("select");
    const [selectedItems, setSelectedItems] = useState<Array<IMarketDataItem>>([]);

    // API Testing State
    const [testLoading, setTestLoading] = useState(false);
    const [showTestSection, setShowTestSection] = useState(true);

    console.log("Selected Items: ", selectedItems);
    const handleGoToCart = () => {
        setCurrentStep("cart");
    };

    const handleBack = () => {
        if (currentStep === "cart") {
            setCurrentStep("select");
        } else if (currentStep === "professional-declaration" || currentStep === "non-professional-declaration") {
            setCurrentStep("cart");
        } else if (currentStep === "terms-and-conditions") {
            setCurrentStep("professional-declaration");
        }
    }
    const handleDeclarationConfirm = () => {
        setCurrentStep("terms-and-conditions");
    };

    const caculateAmount = () => {
        let totalAmount = 0;
        selectedItems.forEach((item) => {
            totalAmount += Number(item.selectedOption?.value.split(" ")[0]);
        });
        return totalAmount;
    };

    // API Test Handlers
    const testGetUserSubscriptionDetails = async () => {
        setTestLoading(true);
        try {
            // Test with a sample subscription ID
            const subscriptionId = "test-sub-123";
            const response = await getUserSubscriptionDetails(subscriptionId);

            if (response.success && response.data) {
                toast.success("API Success: getUserSubscriptionDetails", {
                    description: `Fetched details for subscription: ${subscriptionId}`
                });
                console.log("getUserSubscriptionDetails response:", response.data);
            } else {
                toast.error("API Error: getUserSubscriptionDetails", {
                    description: response.error || "Unknown error"
                });
                console.error("getUserSubscriptionDetails error:", response.error);
            }
        } catch (error) {
            toast.error("API Error: getUserSubscriptionDetails", {
                description: error instanceof Error ? error.message : "Request failed"
            });
            console.error("getUserSubscriptionDetails exception:", error);
        } finally {
            setTestLoading(false);
        }
    };

    const testGetProductSubscriptionsByType = async () => {
        setTestLoading(true);
        try {
            // Test with product type "IPO"
            const productType = "IPO";
            const response = await getProductSubscriptionsByType(productType);

            if (response.success && response.data) {
                toast.success("API Success: getProductSubscriptionsByType", {
                    description: `Fetched ${productType} subscriptions`
                });
                console.log("getProductSubscriptionsByType response:", response.data);
            } else {
                toast.error("API Error: getProductSubscriptionsByType", {
                    description: response.error || "Unknown error"
                });
                console.error("getProductSubscriptionsByType error:", response.error);
            }
        } catch (error) {
            toast.error("API Error: getProductSubscriptionsByType", {
                description: error instanceof Error ? error.message : "Request failed"
            });
            console.error("getProductSubscriptionsByType exception:", error);
        } finally {
            setTestLoading(false);
        }
    };

    const testGetProductDetails = async () => {
        setTestLoading(true);
        try {
            // Test with a sample product code
            const productCode = "test-prod-123";
            const response = await getProductDetails(productCode);

            if (response.success && response.data) {
                toast.success("API Success: getProductDetails", {
                    description: `Fetched details for product: ${productCode}`
                });
                console.log("getProductDetails response:", response.data);
            } else {
                toast.error("API Error: getProductDetails", {
                    description: response.error || "Unknown error"
                });
                console.error("getProductDetails error:", response.error);
            }
        } catch (error) {
            toast.error("API Error: getProductDetails", {
                description: error instanceof Error ? error.message : "Request failed"
            });
            console.error("getProductDetails exception:", error);
        } finally {
            setTestLoading(false);
        }
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
                                : "Declaration"
                    }
                    rightContent={
                        currentStep === "select" ? (
                            <Button variant={"ghost"} className="border text-icon-light">
                                <Boxes /> My Subscriptions
                            </Button>
                        ) : null
                    }

                    showBackButton={currentStep !== "select" && currentStep !== "success"}
                />
            </div>

            {/* API Test Section - Temporary for testing */}
            {showTestSection && currentStep === "select" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-sm">API Testing Section</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowTestSection(false)}
                            className="text-xs h-auto py-1"
                        >
                            Hide
                        </Button>
                    </div>
                    <p className="text-xs text-typo-secondary mb-3">
                        Test the three unused subscription APIs. Check console and toast notifications for results.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={testGetUserSubscriptionDetails}
                            disabled={testLoading}
                            className="text-xs justify-start"
                        >
                            {testLoading ? "Testing..." : "Test getUserSubscriptionDetails()"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={testGetProductSubscriptionsByType}
                            disabled={testLoading}
                            className="text-xs justify-start"
                        >
                            {testLoading ? "Testing..." : "Test getProductSubscriptionsByType()"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={testGetProductDetails}
                            disabled={testLoading}
                            className="text-xs justify-start"
                        >
                            {testLoading ? "Testing..." : "Test getProductDetails()"}
                        </Button>
                    </div>
                </div>
            )}

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
                            <NonProfessional selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                        </TabsContent>
                        <TabsContent
                            value="professional"
                            className="flex-1 overflow-y-auto sidebar-scroll sidebar-offset-2 m-0"
                        >
                            <Professional />
                        </TabsContent>
                    </Tabs>
                    <div className="px-6 py-4 border-t w-full flex justify-between relative gap-2">
                        <div>
                            <p className="text-base font-semibold">{caculateAmount()} SGD</p>
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
                    onCheckout={() => setCurrentStep("professional-declaration")}
                />
            )}

            {/* Step 3 - Declaration */}
            {currentStep === "professional-declaration" && (
                <DeclarationStep
                    onConfirm={handleDeclarationConfirm}
                />
            )}

            {currentStep === "non-professional-declaration" && (
                <NonProDeclarationStep onConfirm={handleDeclarationConfirm} />
            )}
            {currentStep === "terms-and-conditions" && (
                <TermsStep setCurrenStep={setCurrentStep} selectedItems={selectedItems} />
            )}


            {/* Success */}
            {currentStep === "success" && (
                <div className="bg-white rounded-lg flex-1 flex flex-col overflow-hidden min-h-0">
                    <div className={`flex flex-col justify-center items-center py-5 md:py-7 h-full`}>
                        <SuccessState width={100} height={100} className="text-status-disable-primary" />

                        <div
                            className={`mt-6 font-semibold text-typo-primary text-base text-center leading-normal`}
                        >
                            Subscription(s) Submitted
                        </div>

                        <div
                            className={`mt-1 font-normal text-typo-secondary text-sm text-center leading-tight px-5 md:w-2/3`}
                        >
                            Settle the total amount due to enjoy your subscriptions!
                        </div>

                        <div className="mt-6 p-4 rounded-lg bg-background-section flex justify-between items-center w-[calc(100%-48px)]">
                            <div className="">
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