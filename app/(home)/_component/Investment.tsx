"use client";
import { CGSI } from "@/constants/routes";
import { useMediaQuery } from "@/hooks/useMediaQuerry";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { INTERNAL_ROUTES } from "@/constants/routes";

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
	// href = "/",
}) => {
	const isMobile = useMediaQuery("mobile");
	// const router = useRouter();
	return (
		<div
			// onClick={() => router.push(href)}
			className="relative bg-gradient-to-br from-white via-blue-50 to-white shadow-sm rounded-lg w-full "
			style={{
				backgroundImage:
					"linear-gradient(135deg, white 0%, white 25%, rgb(240, 248, 255) 50%, white 75%, white 100%)",
			}}
		>
			<div className="relative border border-transparent rounded-lg w-full">
				<div
					className="bg-gradient-to-br from-white via-blue-50 to-white shadow-sm rounded-lg overflow-hidden"
					style={{
						backgroundImage:
							"linear-gradient(90deg, white 0%, #f6fbff 20%, #d9edff 50%, #f6fbff 80%, white 100%)",
					}}
				>
					<div className="py-3 md:pt-5 md:pb-4 pl-2 md:pl-6 w-2/3">
						<div className="flex md:flex-row flex-col items-baseline gap-4 md:mb-2">
							<h2 className="font-semibold text-enhanced-blue text-xs md:text-lg">{title}</h2>
							<span className="text-[10px] text-typo-tertiary md:text-sm">
								{available != 0 ? `${available} Available` : "No Available"}
							</span>
						</div>
						<p
							hidden={isMobile}
							className="max-w-[70%] lg:max-w-[90%] text-typo-tertiary text-sm line-clamp-2 leading-relaxed"
						>
							{subtext}
						</p>
					</div>
				</div>
			</div>
			<div className="right-0 lg:right-8 bottom-0 absolute h-[90%] md:h-[110%]">
				<Image
					src={imageSrc}
					alt={imageAlt ?? title}
					className="w-auto h-full object-contain scale-x-80 md:scale-x-90"
					width={imageWidth}
					height={imageHeight}
				/>
			</div>
		</div>
	);
};

const Investment = () => {
	return (
		<div className="bg-white container-default">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<span className="font-semibold text-base">Investment Products</span>
					<Image src={"/icons/Warning.svg"} alt="icon" width={16} height={16} />
				</div>
				<div className="">
					<Link
						href={CGSI.EVENTS}
						className="font-normal text-enhanced-blue text-xs md:text-sm"
						target="_blank"
					>
						View All
					</Link>
				</div>
			</div>

			<div className="flex justify-between gap-4 mt-6">
				<InvestmentCard
					href={INTERNAL_ROUTES.SECURITIES}
					title="Securities"
					available={1}
					imageSrc="/icons/Investment-left.svg"
					subtext="Tap into exclusive investment opportunities, from shares at initial offering prices (IOPs) to IPOs"
				/>

				<InvestmentCard
					href={INTERNAL_ROUTES.ALTERNATIVE}
					title="Alternatives"
					available={0}
					imageSrc="/icons/Investment-right.svg"
					subtext="Diversify with curated funds that match different risk profiles and investment horizons"
				/>
			</div>
		</div>
	);
};

export default Investment;
