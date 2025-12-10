"use client";

import { Building2, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PaynowIcon from "@/public/icons/discover/Paynow.svg";
import Image from "./Image";

interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    available: boolean;
}

interface PaymentModelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const BankIcon = () => (
    <Image src={"/icons/Banking.svg"} alt="" height={24} width={24} className="w-6 h-6 text-typo-secondary" />
);

const paymentMethods: PaymentMethod[] = [
    {
        id: "paynow",
        name: "PayNow",
        description: "Available only for deposits in SGD currency",
        icon: <PaynowIcon />,
        available: true,
    },
    {
        id: "bank-transfer",
        name: "Bank Transfer",
        description: "Supports deposits in all available currencies",
        icon: <BankIcon />,
        available: true,
    },
];

export function PaymentModel({ open, onOpenChange }: PaymentModelProps) {
    const handleSelectMethod = (methodId: string) => {
        console.log("Selected payment method:", methodId);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[530px] p-0 gap-0">
                <DialogHeader className="p-6">
                    <DialogTitle className="text-base font-semibold text-typo-primary text-left ">
                        Deposit Methods
                    </DialogTitle>
                </DialogHeader>

                <div className="pad-x pb-6 space-y-6">
                    {paymentMethods.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => handleSelectMethod(method.id)}
                            disabled={!method.available}
                            className="w-full flex items-center gap-4 py-2 px-4 rounded-lg border border-theme-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="flex-shrink-0">{method.icon}</div>

                            <div className="flex-1 text-left">
                                <h3 className="text-sm font-semibold text-typo-primary mb-1">
                                    {method.name}
                                </h3>
                                <p className="text-xs text-typo-secondary">{method.description}</p>
                            </div>

                            <ChevronRight
                                size={16}
                                className="text-typo-tertiary group-hover:text-enhanced-blue transition-colors"
                            />
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
