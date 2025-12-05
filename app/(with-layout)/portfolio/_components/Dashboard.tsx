"use client"

// import { getBgImageClass } from '@/lib/utils'
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
import { ChartPie } from './ChartPie'

type PortfolioType = "CTA" | "MTA" | "SBL" | "CUT" | "iCash"

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
        <div className='bg-background-selected p-3 md:p-4 rounded-lg border border-background-selected hover:border-enhanced-blue transition-colors cursor-pointer'>
            <p className='text-xs md:text-sm text-typo-secondary'>{title}</p>
            <div className="text-sm md:text-base flex justify-between items-end mt-2 flex-wrap gap-2">
                <p className={`font-semibold ${getTextColor()}`}>{amount}</p>
                {showPayButton && (
                    <Button
                        size="sm"
                        className='hidden md:block bg-enhanced-blue hover:bg-enhanced-blue/90 text-xs px-3 h-6'
                        onClick={onPay}
                    >
                        Pay
                    </Button>
                )}
            </div>
        </div>
    )
}

// Các component của bạn
// Helper function to map account type to short code
const getAccountTypeCode = (type: string): PortfolioType => {
    const typeMap: Record<string, PortfolioType> = {
        "Cash Trading Account": "CTA",
        "Margin Trading Account": "MTA",
        "Shares Borrowing Account": "SBL",
        "CUT Account": "CUT",
        "iCash Account": "iCash"
    }
    return typeMap[type] || "CTA"
}

const TypeSelect = () => {
    const { accounts, selectedAccount, setSelectedAccount } = useTradingAccountStore()

    return (
        <div className='bg-background-section p-4 md:p-6 rounded-lg h-full flex flex-col justify-between'>
            <Select
                value={selectedAccount?.id}
                onValueChange={(value) => {
                    const account = accounts.find(acc => acc.id === value)
                    setSelectedAccount(account || null)
                }}
            >
                <SelectTrigger className="w-full md:max-w-[258px] bg-white border border-stroke-secondary rounded-md shadow-none h-auto py-2 px-3">
                    <SelectValue placeholder="Select trading account">
                        {selectedAccount && (
                            <span className="text-sm text-typo-primary font-medium">({getAccountTypeCode(selectedAccount.type)}) {selectedAccount.id}</span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-[--radix-select-trigger-width]">
                    {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                            <span className="text-sm">({getAccountTypeCode(account.type)}) {account.id}</span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="mt-6 flex flex-col md:flex-row justify-between gap-4 md:gap-6 items-start">
                <div className="w-1/2">
                    <p className='text-xs md:text-sm text-typo-secondary'>Total Asset Value</p>
                    <p className='mt-2 text-lg  md:text-2xl font-semibold'>180,000.16 SGD</p>
                </div>

                <Separator orientation="vertical" className="hidden md:block! h-14 bg-tone-blue-02 !w-[1px]" />


                <div className="w-full md:w-1/2">
                    <p className='text-xs md:text-sm text-typo-secondary'>Trading Representative</p>
                    <p className='mt-2 text-base leading-6 font-semibold'>
                        {selectedAccount?.details.representative.name || "N/A"}
                    </p>
                </div>
            </div>
        </div>
    )
}

const SellContracts = () => {
    return <DashboardBlock title="Sell Contracts (10)" amount="+ 60,000.00 SGD" type="success" />
}

const BuyContracts = () => {
    return <DashboardBlock title="Buy Contracts (5)" amount="- 1,000.00 SGD" type="error" showPayButton onPay={() => console.log('Pay clicked')} />
}

const ContraGain = () => {
    return <DashboardBlock title="Contra Gain (5)" amount="+ 60,000.00 SGD" type="success" />
}

const ContraLoss = () => {
    return <DashboardBlock title="Contra Loss (2)" amount="- 1,000.00 SGD" type="error" showPayButton onPay={() => console.log('Pay clicked')} />
}

const AvailTradeLimit = () => {
    return <DashboardBlock title="Avail Trade Limit" amount="0.00 SGD" type="normal" />
}

const CollateralValue = () => {
    return <DashboardBlock title="Collateral Value" amount="34,000.00 SGD" type="normal" />
}

const MarginRatio = () => {
    return <DashboardBlock title="Margin Ratio" amount="111.2%" type="error" />
}

const CashCall = () => {
    return <DashboardBlock title="Cash Call" amount="- 1,000.00 SGD" type="error" showPayButton onPay={() => console.log('Cash Call Pay clicked')} />
}

const Dashboard = () => {
    const { selectedAccount } = useTradingAccountStore()
    const type = selectedAccount ? getAccountTypeCode(selectedAccount.type) : "CTA" as PortfolioType

    // Layout configurations với components tương ứng
    const layoutConfig = {
        CTA: [
            { id: 1, gridArea: "1 / 1 / 2 / 2", component: <SellContracts /> },
            { id: 2, gridArea: "2 / 1 / 3 / 2", component: <BuyContracts /> },
            { id: 3, gridArea: "1 / 2 / 2 / 3", component: <ContraGain /> },
            { id: 4, gridArea: "2 / 2 / 3 / 3", component: <ContraLoss /> },
        ],
        MTA: [
            { id: 1, gridArea: "1 / 1 / 2 / 2", component: <AvailTradeLimit /> },
            { id: 2, gridArea: "2 / 1 / 3 / 2", component: <CollateralValue /> },
            { id: 3, gridArea: "1 / 2 / 2 / 3", component: <MarginRatio /> },
            { id: 4, gridArea: "2 / 2 / 3 / 3", component: <CashCall /> },
        ],
        SBL: [
            { id: 2, gridArea: "1 / 1 / 2 / 3", component: <MarginRatio /> },
            { id: 3, gridArea: "2 / 1 / 3 / 3", component: <CashCall /> },
        ],
        CUT: [],
        iCash: [],
    }

    const currentLayout = layoutConfig[type]

    return (
        <div className='bg-white pad-x py-6 rounded-lg border border-stroke-secondary'>
            <div className="flex flex-col md:flex-row gap-4">
                <div className={cn('w-full', type == "iCash" || type == "CUT" ? '' : 'md:w-1/2')}>
                    <TypeSelect />
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

            <div className="flex text-enhanced-blue text-xs md:text-sm font-medium items-center mt-4 w-full justify-end cursor-pointer hover:text-enhanced-blue/75">
                <p>View Contracts & Contra</p>
                <ChevronRight className="inline-block ml-0.5" size={16} />
            </div>

            <div className="mt-6">
                <ChartPie />
            </div>
        </div>
    )
}

export default Dashboard