"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"
import { PortfolioType } from "../page"

export const description = "A donut chart with asset distribution"

// Default chart data for CTA, MTA, CUT, iCash
const defaultChartData = [
    { asset: "equities", value: 36000.03, percentage: 20.00, fill: "#60A5FA" },
    { asset: "structured", value: 69606.06, percentage: 38.67, fill: "#3B82F6" },
    { asset: "bonds", value: 46800.04, percentage: 26.00, fill: "#1D4ED8" },
    { asset: "cash", value: 21600.02, percentage: 12.00, fill: "#10B981" },
    { asset: "others", value: 5994.01, percentage: 3.33, fill: "#14B8A6" },
]

// SBL specific chart data - Different distribution for Shares Borrowing Account
const sblChartData = [
    { asset: "holdings", value: 45000.00, percentage: 25.00, fill: "#60A5FA" },
    { asset: "borrowed", value: 81000.00, percentage: 45.00, fill: "#3B82F6" },
    { asset: "lend", value: 36000.00, percentage: 20.00, fill: "#1D4ED8" },
    { asset: "cash", value: 18000.00, percentage: 10.00, fill: "#10B981" },
]

const defaultChartConfig = {
    value: {
        label: "Market Value",
    },
    equities: {
        label: "Equities",
        color: "#60A5FA",
    },
    structured: {
        label: "Structured Products",
        color: "#3B82F6",
    },
    bonds: {
        label: "Bonds",
        color: "#1D4ED8",
    },
    cash: {
        label: "Cash Balance",
        color: "#10B981",
    },
    others: {
        label: "Others",
        color: "#14B8A6",
    },
} satisfies ChartConfig

const sblChartConfig = {
    value: {
        label: "Market Value",
    },
    holdings: {
        label: "Holdings & Positions",
        color: "#60A5FA",
    },
    borrowed: {
        label: "Borrowed Shares",
        color: "#3B82F6",
    },
    lend: {
        label: "Lend Shares",
        color: "#1D4ED8",
    },
    cash: {
        label: "Cash Balance",
        color: "#10B981",
    },
} satisfies ChartConfig

type ChartPieProps = {
    type?: PortfolioType
}

export function ChartPie({ type = "CTA" }: ChartPieProps) {
    const chartData = type === "SBL" ? sblChartData : defaultChartData
    const chartConfig = type === "SBL" ? sblChartConfig : defaultChartConfig
    const totalValue = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.value, 0)
    }, [chartData])

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Chart Section */}
            <div className="flex-shrink-0 w-full md:w-1/2">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[290px]"
                >
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="asset"
                            innerRadius={70}
                            outerRadius={100}
                            strokeWidth={0}
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={1}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <g>
                                                <circle
                                                    cx={viewBox.cx}
                                                    cy={viewBox.cy}
                                                    r={70}
                                                    className="fill-background-section"
                                                />
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) - 8}
                                                        className="fill-typo-primary text-sm font-semibold"
                                                    >
                                                        SGD
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 12}
                                                        className="fill-typo-primary text-sm font-semibold"
                                                    >
                                                        {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </tspan>
                                                </text>
                                            </g>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </div>

            {/* Legend Table Section */}
            <div className="flex-1 w-full md:w-1/2 pl-2">
                {/* Header */}
                <div className="grid gap-3 md:gap-4 py-2 text-sm font-medium text-muted-foreground" style={{ gridTemplateColumns: '2fr 0.9fr 1.6fr' }}>
                    <div>Asset Class</div>
                    <div className="text-right">Distribution</div>
                    <div className="text-right">Market Value (SGD)</div>
                </div>

                {/* Data Rows */}
                {chartData.map((item) => {
                    const config = chartConfig[item.asset as keyof typeof chartConfig]
                    return (
                        <div key={item.asset} className="grid gap-2 md:gap-4 py-3 md:py-4 text-sm border-b border-stroke-secondary last:border-0 md:last:border-b" style={{ gridTemplateColumns: '2.1fr 1fr 1.5fr' }}>
                            <div className="flex items-center gap-2 md:gap-4 min-w-0">
                                <div
                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: item.fill }}
                                />
                                <span className="font-medium truncate">{config.label}</span>
                            </div>
                            <div className="text-right font-medium">
                                {item.percentage.toFixed(2)}%
                            </div>
                            <div className="text-right font-medium">
                                {item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
