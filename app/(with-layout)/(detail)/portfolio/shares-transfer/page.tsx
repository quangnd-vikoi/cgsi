"use client";

import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { INTERNAL_ROUTES } from "@/constants/routes";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import CustomCircleAlert from "@/components/CircleAlertIcon";
import { ErrorState } from "@/components/ErrorState";

interface InfoRowProps {
    label: string;
    value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
    <div className="grid grid-cols-2 gap-2">
        <p className="text-sm text-typo-secondary">{label}</p>
        <p className="text-sm text-typo-primary font-medium text-right">
            {value}
        </p>
    </div>
);

const SuccessStep = () => {
    const router = useRouter();

    return (
        <>
            <ErrorState
                className=" mx-auto my-auto"
                type="success"
                title="Your Transfer Request Has Been Submitted"
                titleClassName="px-10"
                description={
                    <div className="text-sm text-typo-secondary text-center mb-4 space-y-4">
                        <p>It will be processed within 7 business days. </p>
                        <p className="px-4">Please note that your request will be on hold until all outstanding contracts have been cleared.  </p>
                        <p className="px-3">
                            You will be notified via email once the transfer has been completed.
                        </p>
                    </div>
                }
            />
            <div className="pad-x py-6 border-t border-stroke-secondary">
                <Button
                    className="w-full"
                    onClick={() => router.push(INTERNAL_ROUTES.PORFOLIO)}
                >
                    Back to Portfolio
                </Button>
            </div>
        </>
    );
};

const SharesTransfer = () => {
    const router = useRouter();
    const { accounts } = useTradingAccountStore();
    const [step, setStep] = useState<1 | 2>(1);
    const [transferAccount, setTransferAccount] = useState<string>("");
    const [agreed, setAgreed] = useState(false);
    const [checkboxError, setCheckboxError] = useState("");

    // Mock data - replace with actual user data
    const clientInfo = {
        name: "Rayhan Abhirama",
        nric: "SKXXX5152",
        cdpAccount: "0521-1234-5678",
        broker: "CGS International Securities Pte Ltd (CGSI)",
    };
    // Set first account as default value
    useEffect(() => {
        if (accounts.length > 0 && !transferAccount) {
            setTransferAccount(accounts[0].id);
        }
    }, [accounts, transferAccount]);

    const handleConfirm = () => {
        // Validate checkbox
        if (!agreed) {
            setCheckboxError("You must agree to the terms and conditions");
            return;
        }

        if (!transferAccount) {
            return;
        }
        // TODO: Handle shares transfer API call

        // Move to success step
        setStep(2);
    };

    const handleCheckboxChange = (checked: boolean) => {
        setAgreed(checked);
        if (checked && checkboxError) {
            setCheckboxError("");
        }
    };

    return (
        <div className="max-w-[480px] w-full mx-auto flex-1 flex flex-col h-full">
            <div className="shrink-0">
                <Title title="Shares Transfer" showBackButton={step === 1} />
            </div>

            <div className="bg-white rounded-lg flex-1 flex flex-col overflow-hidden min-h-0">
                {step === 2 ? (
                    <SuccessStep />
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto">
                            <div className="pad-x pt-6">
                                <h2 className="text-base font-semibold mb-6">Transfer SGX Shares to CGSI</h2>

                                {/* Client Information */}
                                <div className="mb-10 p-4 bg-background-section space-y-4 rounded">
                                    <InfoRow label="Client Name" value={clientInfo.name} />
                                    <InfoRow label="NRIC/ Passport" value={clientInfo.nric} />
                                    <InfoRow label="CDP Account No." value={clientInfo.cdpAccount} />
                                    <InfoRow label="Broker" value={clientInfo.broker} />
                                </div>

                                {/* Transfer Statement */}
                                <p className="text-sm text-typo-primary mb-6">
                                    I would like to transfer my SGX holdings in my CDP Account to the following account:
                                </p>

                                {/* Account Selection - Disabled/Read-only */}
                                <div className="mb-6">
                                    <Label className="text-sm text-typo-secondary mb-2 block">Account</Label>
                                    <Select value={transferAccount} onValueChange={setTransferAccount} disabled>
                                        <SelectTrigger className="w-full opacity-100 cursor-not-allowed disabled:bg-status-disable-secondary disabled:text-typo-tertiary">
                                            <SelectValue placeholder="Select account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((account) => (
                                                <SelectItem key={account.id} value={account.id}>
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-sm font-medium text-typo-primary">
                                                            (CTA) {account.id}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-typo-secondary mt-2">
                                        Trading Representative: {accounts.find(a => a.id === transferAccount)?.trName || ""}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer with Agreement and Buttons */}
                        <div className="">
                            {/* Agreement Section */}
                            <div className="border-y border-stroke-secondary py-6 pad-x">
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="agreement"
                                        checked={agreed}
                                        onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
                                        className="mt-0.5"
                                        error={!!checkboxError}
                                    />
                                    <label
                                        htmlFor="agreement"
                                        className="text-xs text-typo-primary cursor-pointer select-text leading-relaxed"
                                    >
                                        I agree with the{" "}
                                        <a
                                            href="#"
                                            className="text-enhanced-blue font-medium"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            Term & Conditions
                                        </a>{" "}
                                        and understand that:
                                        <ol className="list-decimal ml-4 mt-2 space-y-1">
                                            <li>
                                                Linkage to CDP direct account will be revoked and linked to CGSI sub-account.
                                            </li>
                                            <li>
                                                All the shares in CDP direct account for account selected will be transferred to CGSI sub-account.
                                            </li>
                                        </ol>
                                    </label>
                                </div>
                                {checkboxError && (
                                    <p className="text-status-error text-xs mt-2 flex items-center gap-1 ml-7">
                                        <CustomCircleAlert size={15} />
                                        {checkboxError}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pad-x py-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-none shadow-none text-enhanced-blue hover:bg-enhanced-blue/5"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleConfirm}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SharesTransfer;
