import React, { useEffect, useState } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import Group from "./_components/Group";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import {
    ArrowRightCircle,
    ChevronDown,
    ChevronRight,
    CircleCheck,
    Copy,
    Globe,
    Users,
} from "lucide-react";
import WaringIcon from "@/public/icons/Warning.svg";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, handleCopy, handleCall, handleEmail } from "@/lib/utils";
import { ACCOUNT_TYPE_LABELS } from "@/constants/accounts";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSheetStore } from "@/stores/sheetStore";
import { Separator } from "@radix-ui/react-separator";
import { getTradingRepInfoByAccount } from "@/lib/services/profileService";
import { Skeleton } from "@/components/ui/skeleton";
import type { ITrInfo } from "@/types";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const CPF_EMAIL = "clientservices.sg@cgsi.com";
type PaymentInstructionType = "eps" | "giro" | "giroUnlink";

interface TimelineItemProps {
    step: number;
    title: React.ReactNode;
    description: React.ReactNode;
    isLast?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
    step,
    title,
    description,
    isLast = false,
}) => {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full border border-cgs-blue bg-white flex items-center justify-center font-semibold text-[10px] text-cgs-blue shrink-0">
                    {step}
                </div>
                {!isLast && (
                    <div className="w-[1px] h-full relative bg-status-disable-primary"></div>
                )}
            </div>

            <div className="bg-background-section p-3 rounded mb-6 flex-1 min-w-0">
                <div
                    className={cn(
                        "text-typo-primary font-normal text-sm break-words",
                    )}
                >
                    {title}
                </div>
                {description && (
                    <div className="mt-2 bg-white rounded p-3 border border-stroke-secondary break-words">
                        {description}
                    </div>
                )}
            </div>
        </div>
    );
};

interface LinkageItemProps {
    label: string;
    tooltipContent: string;
    value?: string;
    isLinked?: boolean;
    onUnlink?: () => void;
    actionContent?: React.ReactNode;
    showSeparator?: boolean;
}

const LinkageItem: React.FC<LinkageItemProps> = ({
    label,
    tooltipContent,
    value,
    isLinked = false,
    onUnlink,
    actionContent,
    showSeparator = true,
}) => {
    return (
        <>
            <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2 text-typo-secondary text-xs md:text-sm">
                    {label}
                    <Tooltip>
                        <TooltipTrigger>
                            <WaringIcon />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>{tooltipContent}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="flex justify-between items-center gap-2">
                    {value ? (
                        <>
                            <p className="font-medium text-typo-primary text-sm md:text-base truncate flex-1">
                                {value}
                            </p>
                            {isLinked ? (
                                <Badge
                                    variant="success"
                                    className="relative overflow-visible shrink-0"
                                >
                                    <CircleCheck
                                        size={12}
                                        className="border-tone-green-04 text-tone-green-04"
                                    />
                                    Linked
                                    {onUnlink && (
                                        <Link
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onUnlink();
                                            }}
                                            className="absolute text-status-error -top-7 right-0 text-xs md:text-sm hover:underline"
                                        >
                                            Unlink
                                        </Link>
                                    )}
                                </Badge>
                            ) : (
                                actionContent
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-typo-tertiary">-</p>
                            {actionContent}
                        </>
                    )}
                </div>

                {showSeparator && (
                    <Separator className="h-[1px] bg-stroke-secondary mt-4 -mb-4" />
                )}
            </div>
        </>
    );
};

const TradingAccountDetail = () => {
    const selectedAccount = useTradingAccountStore(
        (state) => state.selectedAccount,
    );
    const router = useRouter();
    const setOpenSheet = useSheetStore((state) => state.setOpenSheet);
    const [trInfo, setTrInfo] = useState<ITrInfo | null>(null);
    const [isTrLoading, setIsTrLoading] = useState(false);
    const [paymentInstructionType, setPaymentInstructionType] =
        useState<PaymentInstructionType | null>(null);
    const fetchedAccountNo = React.useRef<string | null>(null);

    useEffect(() => {
        const accountNo = selectedAccount?.accountNo;
        if (!accountNo || accountNo === fetchedAccountNo.current) return;
        fetchedAccountNo.current = accountNo;

        const fetchTrInfo = async () => {
            try {
                setIsTrLoading(true);
                setTrInfo(null);
                const res = await getTradingRepInfoByAccount(accountNo);
                if (res.success && res.data && res.data.length > 0) {
                    setTrInfo(res.data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch TR info:", error);
            } finally {
                setIsTrLoading(false);
            }
        };
        fetchTrInfo();
    }, [selectedAccount?.accountNo]);

    const isSubCDP = useTradingAccountStore((s) => s.isSubCDP());

    if (!selectedAccount) return null;

    const accountType = selectedAccount.accountType;
    const isCTA = accountType === "CTA";
    const isCUT = accountType === "CUT";
    const isSBL = accountType === "SBL";
    const showCpfSrs = isCTA || isCUT;
    const accountTypeLabel = accountType
        ? (ACCOUNT_TYPE_LABELS[accountType] ?? accountType)
        : "";

    const handleUpdateToSubCDP = () => {
        setOpenSheet(null);
        router.push(INTERNAL_ROUTES.SHARE_TRANSFER);
    };

    const paymentInstructionData = {
        eps: {
            mainTitle: (
                <div className="text-base font-semibold my-6">
                    Follow the instructions below to manage your EPS linkage
                </div>
            ),
            items: [
                {
                    title: (
                        <p>
                            For Linkage of EPS, please visit the website below
                            to download the{" "}
                            <span className="font-bold">
                                EPS Application Form
                            </span>
                            .
                        </p>
                    ),
                    description: (
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center min-w-0">
                                <Globe
                                    size={20}
                                    className="text-icon-light shrink-0"
                                />
                                <p className="text-sm font-normal truncate">
                                    iTrade Application Forms
                                </p>
                            </div>
                            <ChevronRight
                                size={20}
                                className="text-cgs-blue cursor-pointer shrink-0"
                                onClick={() =>
                                    window.open(
                                        "https://www.cgsi.com.sg/info/itrade_application_forms?lang=EN",
                                        "_blank",
                                    )
                                }
                            />
                        </div>
                    ),
                },
                {
                    title: "Complete the EPS Application Form",
                },
                {
                    title: (
                        <p>
                            Email the completed form to our Client Services
                            team. You will receive an email notification once
                            your request has been processed.
                        </p>
                    ),
                    description: (
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="truncate text-typo-primary">
                                    clientservices.sg@cgsi.com
                                </span>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <Copy
                                    onClick={() => handleCopy(CPF_EMAIL)}
                                    size={20}
                                    className="text-cgs-blue cursor-pointer"
                                />
                                <ArrowRightCircle
                                    onClick={() => handleEmail(CPF_EMAIL)}
                                    size={20}
                                    className="text-cgs-blue cursor-pointer"
                                />
                            </div>
                        </div>
                    ),
                },
            ],
        },
        giro: {
            mainTitle: (
                <div className="text-base font-semibold my-6">
                    Follow the instructions below to manage your GIRO linkage
                </div>
            ),
            items: [
                {
                    title: (
                        <p>
                            For Linkage of GIRO, please visit the website below
                            to download the{" "}
                            <span className="font-bold">
                                GIRO Application Form
                            </span>
                            . You can also find the Business Reply Envelope in
                            the link below.
                        </p>
                    ),
                    description: (
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center min-w-0">
                                <Globe
                                    size={20}
                                    className="text-icon-light shrink-0"
                                />
                                <p className="text-sm font-normal truncate">
                                    iTrade Application Forms
                                </p>
                            </div>
                            <ChevronRight
                                size={20}
                                className="text-cgs-blue cursor-pointer shrink-0"
                                onClick={() =>
                                    window.open(
                                        "https://www.cgsi.com.sg/info/itrade_application_forms?lang=EN",
                                        "_blank",
                                    )
                                }
                            />
                        </div>
                    ),
                },
                {
                    title: "Print out the GIRO Application Form and complete it with a wet ink signature",
                },
                {
                    title: (
                        <p>
                            Mail the completed physical form along with the
                            Business Reply Envelope to our office. You will
                            receive an email notification once your request has
                            been processed.
                        </p>
                    ),
                },
            ],
        },
        giroUnlink: {
            mainTitle: (
                <div className="text-base font-semibold my-6">
                    Follow the instructions below to manage your GIRO linkage
                </div>
            ),
            items: [
                {
                    title: (
                        <p>
                            For Revoking of GIRO Linkage, please obtain the
                            relevant GIRO Termination Form from your relevant
                            bank. You can also find the CGSI Business Reply
                            Envelope in the link below.
                        </p>
                    ),
                    description: (
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center min-w-0">
                                <Globe
                                    size={20}
                                    className="text-icon-light shrink-0"
                                />
                                <p className="text-sm font-normal truncate">
                                    iTrade Application Forms
                                </p>
                            </div>
                            <ChevronRight
                                size={20}
                                className="text-cgs-blue cursor-pointer shrink-0"
                                onClick={() =>
                                    window.open(
                                        "https://www.cgsi.com.sg/info/itrade_application_forms?lang=EN",
                                        "_blank",
                                    )
                                }
                            />
                        </div>
                    ),
                },
                {
                    title: "Print out the GIRO Termination Form and complete it with a wet ink signature",
                },
                {
                    title: (
                        <p>
                            Mail the completed physical form along with the
                            Business Reply Envelope to our office. You will
                            receive an email notification once your request has
                            been processed.
                        </p>
                    ),
                },
            ],
        },
    };

    const getCpfEmailBody = () =>
        [
            `Trading Account Number: ${selectedAccount.accountNo}`,
            "",
            "Name of Bank:",
            "CPF Investment Account Number:",
        ].join("\n");

    const getSrsEmailBody = () =>
        [
            `Trading Account Number: ${selectedAccount.accountNo}`,
            "",
            "Name of Bank:",
            "SRS Account Number:",
        ].join("\n");

    const handleCpfLink = () => {
        setOpenSheet(null);
        handleEmail(CPF_EMAIL, "Request to Link CPFIS", getCpfEmailBody());
    };

    const handleCpfUnlink = () => {
        setOpenSheet(null);
        handleEmail(
            CPF_EMAIL,
            "Request to Revoke CPFIS Linkage",
            getCpfEmailBody(),
        );
    };

    const handleSrsLink = () => {
        setOpenSheet(null);
        handleEmail(CPF_EMAIL, "Request to Link SRS", getSrsEmailBody());
    };

    const handleSrsUnlink = () => {
        setOpenSheet(null);
        handleEmail(
            CPF_EMAIL,
            "Request to Revoke SRS Linkage",
            getSrsEmailBody(),
        );
    };

    const handleEpsUnlink = () => {
        setOpenSheet(null);
        handleEmail(
            CPF_EMAIL,
            "Request to Revoke EPS Linkage",
            [
                `Trading Account Number: ${selectedAccount.accountNo}`,
                "",
                "Name of Bank:",
                "Account Number:",
            ].join("\n"),
        );
    };

    const openPaymentInstructions = (type: PaymentInstructionType) => {
        setOpenSheet(null);
        setPaymentInstructionType(type);
    };

    return (
        <div className="flex flex-col h-full">
            <CustomSheetTitle
                backTo="trading_accounts"
                title="Account Details"
            />

            <div className="flex-1 mt-6 pb-4 overflow-y-auto scrollbar-offset-laptop">
                <div className="mb-6">
                    <div className=" flex gap-2 items-center">
                        <p className="text-typo-secondary text-sm">
                            {accountTypeLabel}
                        </p>
                        {selectedAccount.accountTypeCodeNova === "JOINT" && (
                            <div className="border flex gap-1 border-tone-green-04 text-tone-green-04 rounded-xs px-1.5 py-[3px]">
                                <Users size={14} />
                                <span className="text-xs">JOINT</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="font-semibold text-typo-primary text-lg">
                            {selectedAccount.accountNo}
                        </p>
                        <Copy
                            className="text-cgs-blue cursor-pointer"
                            size={20}
                            onClick={() =>
                                handleCopy(selectedAccount.accountNo)
                            }
                        />
                    </div>
                </div>

                {!isSBL && (
                    <Group
                        showSeparator={false}
                        title="Account Linkages"
                        childrenClassName="gap-0"
                    >
                        <LinkageItem
                            label={isSubCDP ? "CDP Sub" : "CDP Direct"}
                            tooltipContent={
                                isSubCDP
                                    ? "An arrangement where your SGX-listed securities are held in custody under CGSI, offering greater convenience and smoother trade settlements."
                                    : "Your SGX-listed securities are held in your personal CDP account. For greater convenience and smoother trade settlement, consider switching to a Sub-CDP with CGSI."
                            }
                            value={selectedAccount.cdp || undefined}
                            actionContent={
                                !isSubCDP && (
                                    <div
                                        className="flex items-center gap-1 text-cgs-blue text-xs md:text-sm font-medium cursor-pointer shrink-0"
                                        onClick={() => handleUpdateToSubCDP()}
                                    >
                                        Update to CDP-Sub-Account
                                        <ChevronRight size={18} />
                                    </div>
                                )
                            }
                            showSeparator={showCpfSrs}
                        />

                        {showCpfSrs && (
                            <>
                                <LinkageItem
                                    label="CPF"
                                    tooltipContent="Link your CPF Investment Account to start investing in eligible assets under the CPF Investment Scheme (CPFIS)."
                                    value={selectedAccount.cpf || undefined}
                                    isLinked={selectedAccount.cpf != null}
                                    onUnlink={handleCpfUnlink}
                                    actionContent={
                                        <div
                                            className="flex items-center gap-1 text-cgs-blue text-xs font-medium cursor-pointer shrink-0"
                                            onClick={handleCpfLink}
                                        >
                                            Link Now
                                            <ChevronRight size={16} />
                                        </div>
                                    }
                                />

                                <LinkageItem
                                    label="SRS"
                                    tooltipContent="Link your SRS account to your trading account to invest in approved products and enjoy potential tax savings under the Supplementary Retirement Scheme."
                                    value={selectedAccount.srs || undefined}
                                    isLinked={selectedAccount.srs != null}
                                    onUnlink={handleSrsUnlink}
                                    actionContent={
                                        <div
                                            className="flex items-center gap-1 text-cgs-blue text-xs font-medium cursor-pointer shrink-0"
                                            onClick={handleSrsLink}
                                        >
                                            Link Now
                                            <ChevronRight size={16} />
                                        </div>
                                    }
                                />

                                {isCTA && (
                                    <LinkageItem
                                        label={
                                            selectedAccount.giro
                                                ? "Payment Method (GIRO)"
                                                : selectedAccount.eps
                                                  ? "Payment Method (EPS)"
                                                  : "Payment Method"
                                        }
                                        tooltipContent="Set up electronic fund transfers via EPS or GIRO to seamlessly pay for share purchases and receive sale proceeds directly from your bank account to CGSI"
                                        value={
                                            selectedAccount.giro ||
                                            selectedAccount.eps ||
                                            undefined
                                        }
                                        isLinked={
                                            !!(
                                                selectedAccount.giro ||
                                                selectedAccount.eps
                                            )
                                        }
                                        onUnlink={() =>
                                            selectedAccount.giro
                                                ? openPaymentInstructions(
                                                      "giroUnlink",
                                                  )
                                                : handleEpsUnlink()
                                        }
                                        actionContent={
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <p className="flex items-center gap-1 text-cgs-blue text-xs font-medium cursor-pointer shrink-0 whitespace-nowrap">
                                                        Setup Now
                                                        <ChevronDown
                                                            size={16}
                                                        />
                                                    </p>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    className="w-36 px-0 py-2 text-sm"
                                                    align="end"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            openPaymentInstructions(
                                                                "eps",
                                                            )
                                                        }
                                                        className="cursor-pointer px-3 py-[10px] rounded-none hover:bg-background-focus"
                                                    >
                                                        EPS
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            openPaymentInstructions(
                                                                "giro",
                                                            )
                                                        }
                                                        className="cursor-pointer px-3 py-[10px] rounded-none hover:bg-background-focus"
                                                    >
                                                        GIRO
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        }
                                        showSeparator={false}
                                    />
                                )}
                            </>
                        )}
                    </Group>
                )}

                <div className="mt-9">
                    <Group title="Trading Representative" showSeparator={false}>
                        {isTrLoading ? (
                            <div className="flex flex-col gap-4 p-4">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center"
                                    >
                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-4 w-1/3" />
                                    </div>
                                ))}
                            </div>
                        ) : trInfo ? (
                            <div className="flex flex-col gap-4 p-4">
                                <div className="flex justify-between items-center text-sm md:text-base gap-2">
                                    <p className="text-typo-secondary shrink-0">
                                        TR Name
                                    </p>
                                    <p className="font-medium text-typo-primary truncate">
                                        {trInfo.trCode} - {trInfo.trName}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center text-sm md:text-base">
                                    <p className="text-typo-secondary">
                                        Rep. No.
                                    </p>
                                    <p className="font-medium text-typo-primary truncate"></p>
                                </div>
                                {trInfo.trContact && (
                                    <div className="flex justify-between items-center text-sm md:text-base">
                                        <p className="text-typo-secondary">
                                            Phone Number
                                        </p>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <p className="font-medium text-typo-primary truncate">
                                                {trInfo.trContact}
                                            </p>
                                            <Copy
                                                onClick={() =>
                                                    handleCopy(trInfo.trContact)
                                                }
                                                className="text-cgs-blue cursor-pointer shrink-0"
                                                size={16}
                                            />
                                            <ArrowRightCircle
                                                onClick={() =>
                                                    handleCall(trInfo.trContact)
                                                }
                                                className="text-cgs-blue cursor-pointer shrink-0"
                                                size={16}
                                            />
                                        </div>
                                    </div>
                                )}
                                {trInfo.trEmail && (
                                    <div className="flex justify-between items-center text-sm md:text-base">
                                        <p className="text-typo-secondary">
                                            Email Add.
                                        </p>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <p className="font-medium text-typo-primary truncate">
                                                {trInfo.trEmail}
                                            </p>
                                            <Copy
                                                onClick={() =>
                                                    handleCopy(trInfo.trEmail)
                                                }
                                                className="text-cgs-blue cursor-pointer shrink-0"
                                                size={16}
                                            />
                                            <ArrowRightCircle
                                                onClick={() =>
                                                    handleEmail(trInfo.trEmail)
                                                }
                                                className="text-cgs-blue cursor-pointer shrink-0"
                                                size={16}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-typo-secondary p-4">
                                No trading representative information available.
                            </p>
                        )}
                    </Group>
                </div>
            </div>

            <Dialog
                open={!!paymentInstructionType}
                onOpenChange={(open) =>
                    !open && setPaymentInstructionType(null)
                }
            >
                <DialogContent className="max-w-[480px] max-h-[85vh] p-0 gap-0 overflow-hidden">
                    {paymentInstructionType && (
                        <div className="bg-white flex flex-col min-h-0">
                            <div className="px-6 pt-10 pb-4 overflow-y-auto">
                                <div className="text-base font-semibold my-6 break-words">
                                    {
                                        paymentInstructionData[
                                            paymentInstructionType
                                        ].mainTitle
                                    }
                                </div>
                                {paymentInstructionData[
                                    paymentInstructionType
                                ].items.map((item, index) => (
                                    <TimelineItem
                                        key={`${paymentInstructionType}-${index}`}
                                        step={index + 1}
                                        title={item.title}
                                        description={item.description}
                                        isLast={
                                            index ===
                                            paymentInstructionData[
                                                paymentInstructionType
                                            ].items.length -
                                                1
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TradingAccountDetail;
