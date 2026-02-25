"use client";
import { useMediaQuery } from "@/hooks/useMediaQuerry";
import Image from "@/components/Image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { INTERNAL_ROUTES } from "@/constants/routes";
import useToggle from "@/hooks/useToggle";
import Alert from "@/components/Alert";
import { useSheetStore } from "@/stores/sheetStore";
import { cn } from "@/lib/utils";
import { getProductSubscriptionsByType } from "@/lib/services/subscriptionService";

type InvestmentCardProps = {
	title: string;
	available?: number | string;
	imageSrc: string;
	subtext: string;
	imageAlt?: string;
	imageWidth?: number;
	imageHeight?: number;
	href: string;
};

const InvestmentCard: React.FC<InvestmentCardProps> = ({
	title,
	available = 0,
	imageSrc,
	subtext,
	imageAlt,
	imageWidth = 110,
	imageHeight = 125,
	href = "/",
}) => {
	const isMobile = useMediaQuery("mobile");
	const router = useRouter();

	const { value, toggle } = useToggle();
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);

	const handleClick = () => {
		if (title === "Alternatives") {
			toggle();
		} else {
			router.push(href);
		}
	};

	const handleAlert = () => {
		toggle();
		setOpenSheet("contact");
	};

	const openDeclarationForm = () => {
		window.open("https://itrade.cgsi.com.sg/app/download/AccreditedInvestor_Declare.pdf", "_blank");
	}
	return (
		<div
			onClick={() => handleClick()}
			className="cursor-pointer relative border border-stroke-secondary rounded-md w-full text-typo-primary hover:shadow-sm"
		>
			<div className="relative border border-transparent rounded w-full hover:shadow-sm">
				<div
					className="overflow-hidden"
				>
					<div className="p-6 w-3/4">
						<div className="flex md:flex-row flex-col items-start md:items-center gap-3 md:mb-2">
							<h2 className="font-semibold text-sm md:text-[20px]">{title}</h2>
							<span className="text-xs text-typo-tertiary md:text-sm">
								{available != 0 ? `${available} Available` : "0 available"}
							</span>
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
			<Alert
				open={value}
				onOpenChange={toggle}
				title="Access to Alternative Investments"
				description={
					<span className="text-sm md:text-base">
						Alternative Investments are available only to Accredited Investors. Please download
						and fill the <span className="text-cgs-blue font-medium underline cursor-pointer underline-offset-2" onClick={() => openDeclarationForm()} >Declaration Form</span>,
						then send it to us via &quot;Contact Us&quot; to proceed.
					</span>
				}
				cancelText="Cancel"
				actionText="Contact Us"
				onAction={handleAlert}
				onCancel={toggle}
			/>
		</div>
	);
};

const Investment = () => {
	const [securitiesCount, setSecuritiesCount] = useState<number>(0);
	const [alternativesCount, setAlternativesCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		// Check if closing date has passed
		const isClosingDatePassed = (endTime: string): boolean => {
			const closingDate = new Date(endTime);
			const now = new Date();
			return now > closingDate;
		};

		const fetchProductCounts = async () => {
			try {
				setIsLoading(true);

				// Fetch Securities (IOP) count - only count available products
				const iopResponse = await getProductSubscriptionsByType("IOP");
				if (iopResponse.success && iopResponse.data?.productSubs) {
					const availableProducts = iopResponse.data.productSubs.filter(
						(product) => !isClosingDatePassed(product.endTime)
					);
					setSecuritiesCount(availableProducts.length);
				}

				// Fetch Alternatives (AI) count - only count available products
				const aiResponse = await getProductSubscriptionsByType("AI");
				if (aiResponse.success && aiResponse.data?.productSubs) {
					const availableProducts = aiResponse.data.productSubs.filter(
						(product) => !isClosingDatePassed(product.endTime)
					);
					setAlternativesCount(availableProducts.length);
				}
			} catch (error) {
				console.error("Error fetching product counts:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProductCounts();
	}, []);

	return (
		<div className="bg-white container-default">
			<div className="flex items-center gap-2">
				<span className="font-semibold text-2xl">Investment Products</span>
			</div>

			<div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
				<InvestmentCard
					href={INTERNAL_ROUTES.SECURITIES}
					title="Securities"
					available={isLoading ? "..." : securitiesCount}
					imageSrc="/icons/Investment-left.svg"
					subtext="Tap into exclusive investment opportunities, from shares at initial offering prices (IOPs) to IPOs"
				/>

				<InvestmentCard
					href={INTERNAL_ROUTES.ALTERNATIVE}
					title="Alternatives"
					available={isLoading ? "..." : alternativesCount}
					imageSrc="/icons/Investment-right.svg"
					subtext="Looking for short-term, high-quality corporate debt instruments? Explore our commercial papers!"
				/>
			</div>
		</div>
	);
};

export default Investment;
