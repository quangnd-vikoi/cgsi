"use client"

import { Separator } from '@/components/ui/separator'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useTradingAccountStore } from '@/stores/tradingAccountStore'
import React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PortfolioType } from '@/types'
import type { IAccountSummary } from '@/types'
import { ChartPie } from './ChartPie'
import { PaymentModel } from '@/components/PaymentModel'
import { useRouter } from 'next/navigation'
import { INTERNAL_ROUTES } from '@/constants/routes'
import Link from 'next/link'
import { getAccountSummary } from '@/lib/services/portfolioService'

const formatAmount = (value: number | undefined, currency = "SGD") => {
    if (value === undefined || value === null) return `0.00 ${currency}`
    const prefix = value >= 0 ? "+ " : "- "
    return `${prefix}${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
}

const formatAmountNoSign = (value: number | undefined, currency = "SGD") => {
    if (value === undefined || value === null) return `0.00 ${currency}`
    return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
}

type DashboardBlockProps = {
    title: string
    amount: string
    type?: 'normal' | 'success' | 'error'
    showPayButton?: boolean
    onPay?: () => void
}

const DashboardBlock = ({ title, amount, type = 'normal', showPayButton = false, onPay }: DashboardBlockProps) => {
    const getTextColor = () => {
        switch (type) {
            case 'success':
                return 'text-status-success'
            case 'error':
                return 'text-status-error'
            default:
                return 'text-typo-primary'
        }
    }

    return (
        <div className='bg-background-selected p-3 md:p-4 rounded border border-background-selected hover:border-cgs-blue transition-colors cursor-pointer'>
            <p className='text-xs md:text-sm text-typo-secondary'>{title}</p>
            <div className="text-sm md:text-base flex justify-between items-end mt-2 flex-wrap gap-2">
                <p className={`font-semibold ${getTextColor()}`}>{amount}</p>
                {showPayButton && (
                    <Button
                        size="sm"
                        className='hidden md:block bg-cgs-blue hover:bg-cgs-blue/90 rounded text-xs px-3 h-6'
                        onClick={onPay}
                    >
                        Pay
                    </Button>
                )}
            </div>
        </div>
    )
}

const TypeSelect = ({ totalAsset }: { totalAsset: number }) => {
    const { accounts, selectedAccount, setSelectedAccount } = useTradingAccountStore()

    return (
        <div className='bg-background-section p-4 md:p-6 rounded h-full flex flex-col justify-between'>
            <Select
                value={selectedAccount?.accountNo}
                onValueChange={(value) => {
                    const account = accounts.find(acc => acc.accountNo === value)
                    setSelectedAccount(account || null)
                }}
            >
                <SelectTrigger className="w-full md:max-w-[258px] bg-white border border-stroke-secondary rounded-md shadow-none h-auto py-2 px-3">
                    <SelectValue placeholder="Select trading account">
                        {selectedAccount && (
                            <span className="text-sm text-typo-primary font-medium">{selectedAccount.accountType ? `(${selectedAccount.accountType})` : ""} {selectedAccount.accountNo}</span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-[--radix-select-trigger-width]">
                    {accounts.map((account) => (
                        <SelectItem key={account.accountNo} value={account.accountNo}>
                            <span className="text-sm">{account.accountType ? `(${account.accountType})` : ""} {account.accountNo}</span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="mt-6 flex flex-col md:flex-row justify-between gap-4 md:gap-6 items-start">
                <div className="w-full md:w-1/2">
                    <p className='text-xs md:text-sm text-typo-secondary'>Total Asset Value</p>
                    <p className='mt-2 text-lg  md:text-2xl font-semibold'>
                        {totalAsset.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SGD
                    </p>
                </div>

                <Separator orientation="vertical" className="hidden md:block! h-14 bg-tone-blue-02 !w-[1px]" />


                <div className="w-full md:w-1/2">
                    <p className='text-xs md:text-sm text-typo-secondary'>Trading Representative</p>
                    <p className='mt-2 text-base leading-6 font-semibold'>
                        {selectedAccount?.trName || "N/A"}
                    </p>
                </div>
            </div>
        </div>
    )
}

type DashboardProps = {
    type?: PortfolioType
    onTypeChange?: (type: PortfolioType) => void
}

const Dashboard = ({ type: propType, onTypeChange }: DashboardProps) => {
    const { selectedAccount } = useTradingAccountStore()
    const accountType = (selectedAccount?.accountType ? selectedAccount.accountType : "CTA") as PortfolioType
    const router = useRouter()

    const type = propType || accountType

    const [summary, setSummary] = React.useState<IAccountSummary | null>(null)
    const [showPaymentModel, setShowPaymentModel] = React.useState(false)

    React.useEffect(() => {
        if (onTypeChange && accountType !== propType) {
            onTypeChange(accountType)
        }
    }, [accountType, onTypeChange, propType])

    React.useEffect(() => {
        const fetchSummary = async () => {
            if (!selectedAccount?.accountNo) return
            const response = await getAccountSummary(selectedAccount.accountNo)
            if (response.success && response.data) {
                setSummary(response.data)
            }
        }
        fetchSummary()
    }, [selectedAccount?.accountNo])

    // Layout configurations with API-driven data
    const layoutConfig = {
        CTA: [
            {
                id: 1, gridArea: "1 / 1 / 2 / 2",
                component: <DashboardBlock title="Sell Contracts" amount={formatAmount(summary?.contractsSell)} type="success" />
            },
            {
                id: 2, gridArea: "1 / 2 / 2 / 3",
                component: <DashboardBlock
                    title="Buy Contracts"
                    amount={formatAmount(summary?.contractsBuy !== undefined ? -Math.abs(summary.contractsBuy) : undefined)}
                    type="error"
                    showPayButton
                    onPay={() => router.push(INTERNAL_ROUTES.SETTLE)}
                />
            },
            {
                id: 3, gridArea: "2 / 1 / 3 / 2",
                component: <DashboardBlock title="Contra Gain" amount={formatAmount(summary?.contraSell)} type="success" />
            },
            {
                id: 4, gridArea: "2 / 2 / 3 / 3",
                component: <DashboardBlock
                    title="Contra Loss"
                    amount={formatAmount(summary?.contraBuy !== undefined ? -Math.abs(summary.contraBuy) : undefined)}
                    type="error"
                    showPayButton
                    onPay={() => router.push(INTERNAL_ROUTES.SETTLE)}
                />
            },
        ],
        MTA: [
            {
                id: 1, gridArea: "1 / 1 / 2 / 2",
                component: <DashboardBlock title="Avail Trade Limit" amount={formatAmountNoSign(summary?.tradeLimit)} type="normal" />
            },
            {
                id: 2, gridArea: "2 / 1 / 3 / 2",
                component: <DashboardBlock title="Margin Ratio" amount={summary?.marginRatio !== undefined ? `${summary.marginRatio}%` : "0%"} type={summary?.marginRatio !== undefined && summary.marginRatio < 140 ? "error" : "normal"} />
            },
            {
                id: 3, gridArea: "1 / 2 / 2 / 3",
                component: <DashboardBlock title="Collateral Value" amount={formatAmountNoSign(summary?.collateralValue)} type="normal" />
            },
            {
                id: 4, gridArea: "2 / 2 / 3 / 3",
                component: (
                    <>
                        <DashboardBlock
                            title="Cash Call"
                            amount={formatAmount(summary?.cashCall !== undefined ? -Math.abs(summary.cashCall) : undefined)}
                            type="error"
                            showPayButton
                            onPay={() => setShowPaymentModel(true)}
                        />
                        <PaymentModel open={showPaymentModel} onOpenChange={setShowPaymentModel} />
                    </>
                )
            },
        ],
        SBL: [
            {
                id: 2, gridArea: "1 / 1 / 2 / 3",
                component: <DashboardBlock title="Margin Ratio" amount={summary?.marginRatio !== undefined ? `${summary.marginRatio}%` : "0%"} type={summary?.marginRatio !== undefined && summary.marginRatio < 140 ? "error" : "normal"} />
            },
            {
                id: 3, gridArea: "2 / 1 / 3 / 3",
                component: (
                    <>
                        <DashboardBlock
                            title="Cash Call"
                            amount={formatAmount(summary?.cashCall !== undefined ? -Math.abs(summary.cashCall) : undefined)}
                            type="error"
                            showPayButton
                            onPay={() => setShowPaymentModel(true)}
                        />
                        <PaymentModel open={showPaymentModel} onOpenChange={setShowPaymentModel} />
                    </>
                )
            },
        ],
        CUT: [],
        iCash: [],
    }

    const currentLayout = layoutConfig[type]

    return (
        <div className='bg-white pad-x py-6 rounded border border-stroke-secondary'>
            <div className="flex flex-col md:flex-row gap-4">
                <div className={cn('w-full', type == "iCash" || type == "CUT" ? '' : 'md:w-1/2')}>
                    <TypeSelect totalAsset={summary?.totalAsset ?? 0} />
                </div>

                {type != "iCash" && type != "CUT" && (
                    <div className="grid gap-4 grid-cols-2 grid-rows-2 w-full md:w-1/2">
                        {currentLayout.map((item) => (
                            <div
                                key={item.id}
                                style={{ gridArea: item.gridArea }}
                            >
                                {item.component}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {

                type === "CTA" &&
                <div className='flex w-full justify-end'>
                    <Link href={INTERNAL_ROUTES.SETTLE} className="flex text-cgs-blue text-xs md:text-sm font-medium items-center mt-4 cursor-pointer hover:text-cgs-blue/75">
                        <p>View Contracts & Contra</p>
                        <ChevronRight className="inline-block ml-0.5" size={16} />
                    </Link>
                </div>
            }
            {
                ["SBL", "MTA"].includes(type) &&
                <div className='flex w-full justify-end'>
                    <Button variant={'ghost'} className="flex text-cgs-blue text-xs md:text-sm font-medium items-center mt-4 cursor-pointer hover:text-cgs-blue/75 hover:bg-transparent">
                        <p>Fund Account</p>
                        <ChevronRight className="inline-block ml-0.5" size={16} />
                    </Button>
                </div>

            }


            <div className="mt-6">
                <ChartPie type={type} />
            </div>
        </div>
    )
}

export default Dashboard
