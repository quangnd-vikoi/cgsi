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
import { Loader2 } from "lucide-react";
import CustomCircleAlert from "@/components/CircleAlertIcon";
import { ErrorState } from "@/components/ErrorState";
import { getCdpTransfer, submitCdpTransfer } from "@/lib/services/portfolioService";
import type { ICDPTransfer } from "@/types";

interface InfoRowProps {
    label: string;
    value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
    <div className="grid grid-cols-2 gap-2">
        <p className="text-sm md:text-base text-typo-secondary">{label}</p>
        <p className="text-sm md:text-base text-typo-primary font-medium text-right">
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
    const accounts = useTradingAccountStore(s => s.accounts);
    const [step, setStep] = useState<1 | 2>(1);
    const [transferAccount, setTransferAccount] = useState<string>("");
    const [agreed, setAgreed] = useState(false);
    const [checkboxError, setCheckboxError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [cdpData, setCdpData] = useState<ICDPTransfer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const res = await getCdpTransfer();
            if (res.success && res.data) {
                setCdpData(res.data);
                const firstAccount = res.data.accountList[0]?.acctNo;
                if (firstAccount) setTransferAccount(firstAccount);
            } else {
                const fallback = useTradingAccountStore.getState().accounts;
                if (fallback.length > 0) setTransferAccount(fallback[0].accountNo);
            }
            setLoading(false);
        };
        init();
    }, []);

    const handleConfirm = async () => {
        if (!agreed) {
            setCheckboxError("You must agree to the terms and conditions");
            return;
        }
        if (!transferAccount) return;

        setSubmitting(true);
        const response = await submitCdpTransfer(transferAccount);
        setSubmitting(false);

        if (response.success) {
            setStep(2);
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        setAgreed(checked);
        if (checked && checkboxError) {
            setCheckboxError("");
        }
    };

    const accountList = cdpData?.accountList ?? accounts.map(a => ({
        acctNo: a.accountNo,
        acctType: a.accountType ?? "",
        trCode: "",
        trName: a.trName ?? "",
    }));
    const selectedAccountInfo = accountList.find(a => a.acctNo === transferAccount);

    return (
        <div className="max-w-[480px] w-full mx-auto flex-1 flex flex-col h-full">
            <div className="shrink-0">
                <Title title="Shares Transfer" showBackButton={step === 1} />
            </div>

            <div className="bg-white rounded flex-1 flex flex-col overflow-hidden min-h-0">
                {step === 2 ? (
                    <SuccessStep />
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto">
                            <div className="pad-x pt-6">
                                <h2 className="text-base font-semibold mb-6">Transfer SGX Shares to CGSI</h2>

                                {/* Client Information */}
                                <div className="mb-10 p-4 bg-background-section space-y-4 rounded">
                                    {loading ? (
                                        <>
                                            {["Client Name", "NRIC/ Passport", "CDP Account No.", "Broker"].map((label) => (
                                                <div key={label} className="grid grid-cols-2 gap-2">
                                                    <p className="text-sm md:text-base text-typo-secondary">{label}</p>
                                                    <div className="h-4 w-32 bg-stroke-secondary animate-pulse rounded ml-auto" />
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <InfoRow label="Client Name" value={cdpData?.name ?? ""} />
                                            <InfoRow label="NRIC/ Passport" value={cdpData?.nricPassport ?? ""} />
                                            <InfoRow label="CDP Account No." value={cdpData?.cdpNo ?? ""} />
                                            <InfoRow label="Broker" value="CGS International Securities Pte Ltd (CGSI)" />
                                        </>
                                    )}
                                </div>

                                {/* Transfer Statement */}
                                <p className="text-sm md:text-base text-typo-primary mb-6">
                                    I would like to transfer my SGX holdings in my CDP Account to the following account:
                                </p>

                                {/* Account Selection - Disabled/Read-only */}
                                <div className="mb-6">
                                    <Label className="text-sm md:text-base text-typo-secondary mb-2 block">Account</Label>
                                    <Select value={transferAccount} onValueChange={setTransferAccount} disabled>
                                        <SelectTrigger className="w-full opacity-100 cursor-not-allowed disabled:bg-status-disable-secondary disabled:text-typo-tertiary">
                                            <SelectValue placeholder="Select account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accountList.map((account) => (
                                                <SelectItem key={account.acctNo} value={account.acctNo}>
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-sm md:text-base font-medium text-typo-primary">
                                                            {account.acctType ? `(${account.acctType}) ` : ""}{account.acctNo}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs md:text-sm text-typo-secondary mt-2">
                                        Trading Representative: {selectedAccountInfo?.trName ?? ""}
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
                                        className="text-base text-typo-primary cursor-pointer select-text leading-relaxed"
                                    >
                                        I agree with the{" "}
                                        <a
                                            href="#"
                                            className="text-cgs-blue font-medium underline underline-offset-2"
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
                                    className="flex-1 border-none shadow-none text-cgs-blue hover:bg-cgs-blue/5"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleConfirm}
                                    disabled={submitting}
                                >
                                    {submitting ? <Loader2 className="animate-spin" /> : "Confirm"}
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
