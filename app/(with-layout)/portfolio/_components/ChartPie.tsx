"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"

export const description = "A donut chart with asset distribution"

const chartData = [
    { asset: "equities", value: 36000.03, percentage: 20.00, fill: "#60A5FA" },
    { asset: "structured", value: 69606.06, percentage: 38.67, fill: "#3B82F6" },
    { asset: "bonds", value: 46800.04, percentage: 26.00, fill: "#1D4ED8" },
    { asset: "cash", value: 21600.02, percentage: 12.00, fill: "#10B981" },
    { asset: "others", value: 5994.01, percentage: 3.33, fill: "#14B8A6" },
]

const chartConfig = {
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

export function ChartPie() {
    const totalValue = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.value, 0)
    }, [])

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Chart Section */}
            <div className="flex-shrink-0 w-full md:w-1/2">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-[280px] h-[280px]"
                >
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="asset"
                            innerRadius={80}
                            outerRadius={110}
                            strokeWidth={0}
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={1}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 8}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    SGD
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 12}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </tspan>
                                            </text>
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
