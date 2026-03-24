"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"
import { IAssetSummary, PortfolioType } from "@/types"
import { ASSET_CLASS_LABELS } from "@/constants/accounts"
import { Skeleton } from "@/components/ui/skeleton"

const ASSET_CLASS_ORDER = ["E", "W", "B", "C", "O"]

const ASSET_CLASS_COLORS: Record<string, string> = {
    E: "#003E86",
    W: "#005CC8",
    B: "#3087EF",
    C: "#91C0F6",
    O: "#D9E6FF",
}

type ChartPieProps = {
    type?: PortfolioType
    assetList?: IAssetSummary[]
    isLoading?: boolean
}

export function ChartPie({ type = "CTA", assetList, isLoading = false }: ChartPieProps) {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

    const chartData = React.useMemo(() => {
        if (!assetList || assetList.length === 0) return []
        const nonZero = assetList.filter((item) => item.value !== 0)
        if (nonZero.length === 0) return []
        const total = nonZero.reduce((sum, item) => sum + item.value, 0)
        return nonZero
            .sort((a, b) => ASSET_CLASS_ORDER.indexOf(a.assetClass) - ASSET_CLASS_ORDER.indexOf(b.assetClass))
            .map((item) => ({
                asset: item.assetClass,
                label: ASSET_CLASS_LABELS[item.assetClass] || item.assetClass,
                value: item.value,
                percentage: total > 0 ? (item.value / total) * 100 : 0,
                fill: ASSET_CLASS_COLORS[item.assetClass] || "#D9E6FF",
            }))
    }, [assetList])

    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            value: { label: "Market Value" },
        }
        chartData.forEach((item) => {
            config[item.asset] = {
                label: item.label,
                color: item.fill,
            }
        })
        return config
    }, [chartData])

    const totalValue = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.value, 0)
    }, [chartData])

    const activeItem = activeIndex !== null ? chartData[activeIndex] : null

    if (isLoading) {
        return (
            <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center">
                    <Skeleton className="w-[290px] h-[290px] rounded-full" />
                </div>
                <div className="flex-1 w-full md:w-1/2 pl-2 space-y-4">
                    <div className="grid gap-3 md:gap-4 py-2" style={{ gridTemplateColumns: '2fr 0.9fr 1.6fr' }}>
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16 ml-auto" />
                        <Skeleton className="h-4 w-24 ml-auto" />
                    </div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="grid gap-3 md:gap-4 py-3" style={{ gridTemplateColumns: '2fr 0.9fr 1.6fr' }}>
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4 rounded-full" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-4 w-12 ml-auto" />
                            <Skeleton className="h-4 w-20 ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-[290px] text-typo-secondary text-sm">
                No asset data available
            </div>
        )
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8">
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
                {activeItem && (
                    <div className="absolute bottom-0 left-0 z-10 flex items-center gap-2 rounded bg-white shadow-lg border border-stroke-secondary whitespace-nowrap">
                        <span
                            className="text-sm font-semibold text-white px-2 py-1 rounded"
                            style={{ backgroundColor: activeItem.fill }}
                        >
                            {activeItem.percentage.toFixed(2)}%
                        </span>
                        <span className="text-sm text-typo-primary font-semibold">
                            {activeItem.label}
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
                                <span className="font-medium truncate">{item.label}</span>
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
