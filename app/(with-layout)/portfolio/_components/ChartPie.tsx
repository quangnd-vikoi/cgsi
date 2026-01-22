"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"
import { PortfolioType } from "@/types"

export const description = "A donut chart with asset distribution"

// Default chart data for CTA, MTA, CUT, iCash
const defaultChartData = [
    { asset: "equities", value: 36000.03, percentage: 20.00, fill: "#003E86" },
    { asset: "structured", value: 69606.06, percentage: 38.67, fill: "#005CC8" },
    { asset: "bonds", value: 46800.04, percentage: 26.00, fill: "#3087EF" },
    { asset: "cash", value: 21600.02, percentage: 12.00, fill: "#91C0F6" },
    { asset: "others", value: 5994.01, percentage: 3.33, fill: "#D9E6FF" },
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
        color: "#003E86",
    },
    structured: {
        label: "Structured Products",
        color: "#005CC8",
    },
    bonds: {
        label: "Bonds",
        color: "#3087EF",
    },
    cash: {
        label: "Cash Balance",
        color: "#91C0F6",
    },
    others: {
        label: "Others",
        color: "#D9E6FF",
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
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

    const totalValue = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.value, 0)
    }, [chartData])

    const activeItem = activeIndex !== null ? chartData[activeIndex] : null
    const activeConfig = activeItem ? chartConfig[activeItem.asset as keyof typeof chartConfig] : null

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Chart Section */}
            <div className="relative flex-shrink-0 w-full md:w-1/2 flex flex-col items-center">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[290px] h-[290px]"
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
                            activeIndex={activeIndex ?? undefined}
                            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                                <Sector {...props} outerRadius={outerRadius + 10} />
                            )}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
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

                {/* Fixed Tooltip at bottom left corner */}
                {activeItem && activeConfig && (
                    <div className="absolute bottom-0 left-0 z-10 flex items-center gap-2 rounded bg-white shadow-lg border border-stroke-secondary whitespace-nowrap">
                        <span
                            className="text-sm font-semibold text-white px-2 py-1 rounded"
                            style={{ backgroundColor: activeItem.fill }}
                        >
                            {activeItem.percentage.toFixed(2)}%
                        </span>
                        <span className="text-sm text-typo-primary font-semibold">
                            {activeConfig.label}
                        </span>
                        <span className="text-sm text-typo-secondary pr-2">
                            ({activeItem.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SGD)
                        </span>
                    </div>
                )}
            </div>

            {/* Legend Table Section */}
            <div className="flex-1 w-full md:w-1/2 pl-2">
                {/* Header */}
                <div className="grid gap-3 md:gap-4 py-2 text-sm font-medium text-muted-foreground" style={{ gridTemplateColumns: '2fr 0.9fr 1.6fr' }}>
                    <div className="pl-2">Asset Class</div>
                    <div className="text-right">Distribution</div>
                    <div className="text-right">Market Value (SGD)</div>
                </div>

                {/* Data Rows */}
                {chartData.map((item, index) => {
                    const config = chartConfig[item.asset as keyof typeof chartConfig]
                    const isActive = activeIndex === index
                    return (
                        <div
                            key={item.asset}
                            className={`grid gap-2 md:gap-4 py-3 md:py-4 text-xs md:text-sm border-b border-stroke-secondary last:border-0 md:last:border-b cursor-pointer transition-colors ${isActive ? 'bg-background-section' : 'hover:bg-background-section'}`}
                            style={{ gridTemplateColumns: '2.1fr 1fr 1.5fr' }}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            <div className="flex items-center pl-2 gap-2 md:gap-4 min-w-0">
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
