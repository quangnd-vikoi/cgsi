"use client";
import { useMediaQuery } from "@/hooks/useMediaQuerry";
import Image from "@/components/Image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { INTERNAL_ROUTES } from "@/constants/routes";
import useToggle from "@/hooks/useToggle";
import { AlternativesAccessAlert } from "@/components/AlternativesAccessAlert";
import { useSheetStore } from "@/stores/sheetStore";
import { cn } from "@/lib/utils";
import { getProductSubscriptionsByType } from "@/lib/services/subscriptionService";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";

type InvestmentCardProps = {
	title: string;
	available?: number | null;
	imageSrc: string;
	subtext: string;
	imageAlt?: string;
	imageWidth?: number;
	imageHeight?: number;
	href: string;
};

const InvestmentCard: React.FC<InvestmentCardProps> = ({
	title,
	available = null,
	imageSrc,
	subtext,
	imageAlt,
	imageWidth = 110,
	imageHeight = 125,
	href = "/",
}) => {
	const isMobile = useMediaQuery("mobile");
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const { value, toggle, setFalse } = useToggle();
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);

	const handleClick = () => {
		if (title === "Alternatives") {
			const { selectedAccount, isInitialized } =
				useTradingAccountStore.getState();
			if (isInitialized) {
				if (selectedAccount?.accreditedInvestor === "Yes") {
					router.push(href);
				} else {
					toggle();
				}
			} else {
				setLoading(true);
				const unsub = useTradingAccountStore.subscribe((state) => {
					if (state.isInitialized && (state.selectedAccount !== null || state.accounts.length === 0)) {
						unsub();
						setLoading(false);
						if (state.selectedAccount?.accreditedInvestor === "Yes") {
							router.push(href);
						} else {
							toggle();
						}
					}
				});
			}
		} else {
			router.push(href);
		}
	};

	const handleAlert = () => {
		setFalse();
		setOpenSheet("contact");
	};

	return (
		<>
			<div
				onClick={() => handleClick()}
				className={cn(
					"relative border border-stroke-secondary rounded-md w-full text-typo-primary hover:shadow-sm",
					loading ? "cursor-wait" : "cursor-pointer"
				)}
			>
				<div className="relative border border-transparent rounded w-full hover:shadow-sm">
					<div
						className="overflow-hidden"
					>
						<div className="p-6 w-3/4">
							<div className="flex md:flex-row flex-col items-start md:items-center gap-3 md:mb-2">
								<h2 className="font-semibold text-sm md:text-[20px]">{title}</h2>
								{available != null && (
									<span className="text-xs text-typo-tertiary md:text-sm">
										{available} Available
									</span>
								)}
							</div>
							<p
								hidden={isMobile}
								className="max-w-[70%] lg:max-w-[82%] text-typo-secondary text-base line-clamp-2 leading-relaxed"
							>
								{subtext}
							</p>
						</div>
					</div>
				</div>
				<div className={cn("right-6 md:right-5 bottom-0 absolute ", title === "Securities" ? "h-[105%]" : "h-full")}>
					<Image
						src={imageSrc}
						alt={imageAlt ?? title}
						className="w-auto h-full object-contain"
						width={imageWidth}
						height={imageHeight}
					/>
				</div>
			</div>
			<AlternativesAccessAlert
				open={value}
				onOpenChange={(open) => { if (!open) setFalse(); }}
				onCancel={setFalse}
				onAction={handleAlert}
			/>
		</>
	);
};

const Investment = () => {
	const [securitiesCount, setSecuritiesCount] = useState<number | null>(null);
	const [alternativesCount, setAlternativesCount] = useState<number | null>(null);
	const selectedAccount = useTradingAccountStore((s) => s.selectedAccount);
	const isInitialized = useTradingAccountStore((s) => s.isInitialized);
	const isAI = isInitialized && selectedAccount?.accreditedInvestor === "Yes";

	useEffect(() => {
		if (!isInitialized) return;

		const isClosingDatePassed = (endTime: string): boolean => {
			const closingDate = new Date(endTime);
			const now = new Date();
			return now > closingDate;
		};

		const fetchProductCounts = async () => {
			const promises: Promise<Awaited<ReturnType<typeof getProductSubscriptionsByType>>>[] = [
				getProductSubscriptionsByType("IOP"),
			];
			if (isAI) {
				promises.push(getProductSubscriptionsByType("AI"));
			}

			const results = await Promise.allSettled(promises);

			const iopResponse = results[0];
			if (iopResponse.status === "fulfilled" && iopResponse.value.success && iopResponse.value.data?.productSubs) {
				const count = iopResponse.value.data.productSubs.filter(
					(product) => !isClosingDatePassed(product.endTime)
				).length;
				setSecuritiesCount(count);
			}

			if (isAI && results[1]) {
				const aiResponse = results[1];
				if (aiResponse.status === "fulfilled" && aiResponse.value.success && aiResponse.value.data?.productSubs) {
					const count = aiResponse.value.data.productSubs.filter(
						(product) => !isClosingDatePassed(product.endTime)
					).length;
					setAlternativesCount(count);
				}
			}
		};

		fetchProductCounts();
	}, [isInitialized, isAI]);

	return (
		<div className="bg-white container-default">
			<div className="flex items-center gap-2">
				<span className="font-semibold text-2xl">Investment Products</span>
			</div>

			<div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
				<InvestmentCard
					href={INTERNAL_ROUTES.SECURITIES}
					title="Securities"
					available={securitiesCount}
					imageSrc="/icons/Investment-left.svg"
					subtext="Tap into exclusive investment opportunities, from shares at initial offering prices (IOPs) to IPOs"
				/>

				<InvestmentCard
					href={INTERNAL_ROUTES.ALTERNATIVE}
					title="Alternatives"
					available={alternativesCount}
					imageSrc="/icons/Investment-right.svg"
					subtext="Looking for short-term, high-quality corporate debt instruments? Explore our commercial papers!"
				/>
			</div>
		</div>
	);
};

export default Investment;
