interface AmountDisplayOptions {
	currency?: string;
	isPositive?: boolean;
	important?: boolean;
}

interface AmountDisplay {
	text: string;
	className: string;
}

export function getAmountDisplay(
	value: number | undefined | null,
	{ currency, isPositive, important = false }: AmountDisplayOptions = {}
): AmountDisplay {
	const neutralClassName = important ? "!text-typo-primary" : "text-typo-primary";
	const positiveClassName = important ? "!text-status-success" : "text-status-success";
	const negativeClassName = important ? "!text-status-error" : "text-status-error";

	if (value === undefined || value === null) {
		return { text: "—", className: neutralClassName };
	}

	const abs = Math.abs(value).toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	const suffix = currency ? ` ${currency}` : "";

	if (value === 0) {
		return { text: `${abs}${suffix}`, className: neutralClassName };
	}

	const positive = isPositive ?? value > 0;

	return positive
		? { text: `+${abs}${suffix}`, className: positiveClassName }
		: { text: `-${abs}${suffix}`, className: negativeClassName };
}
