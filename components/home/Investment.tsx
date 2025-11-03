"use client";
import { ENDPOINT } from "@/constants/routes";
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
	href = "/",
}) => {
	const isMobile = useMediaQuery("mobile");
	const router = useRouter();
	return (
		<div
			onClick={() => router.push(href)}
			className="relative rounded-lg bg-gradient-to-br from-white via-blue-50 to-white shadow-sm w-full cursor-pointer "
			style={{
				backgroundImage:
					"linear-gradient(135deg, white 0%, white 25%, rgb(240, 248, 255) 50%, white 75%, white 100%)",
			}}
		>
			<div className="relative rounded-lg w-full border border-transparent hover:border-background-selected hover:shadow">
				<div
					className="overflow-hidden rounded-lg bg-gradient-to-br from-white via-blue-50 to-white shadow-sm"
					style={{
						backgroundImage:
							"linear-gradient(90deg, white 0%, #f6fbff 20%, #d9edff 50%, #f6fbff 80%, white 100%)",
					}}
				>
					<div className="pl-2 py-3 md:pl-6 md:pt-5 md:pb-4 w-2/3">
						<div className="flex flex-col md:flex-row items-baseline gap-4 md:mb-2">
							<h2 className="text-xs md:text-lg font-semibold text-enhanced-blue">{title}</h2>
							<span className="text-[10px] md:text-sm text-typo-tertiary">
								{available != 0 ? `${available} Available` : "No Available"}
							</span>
						</div>
						<p
							hidden={isMobile}
							className="text-typo-tertiary leading-relaxed text-sm max-w-[70%] lg:max-w-[90%] line-clamp-2"
						>
							{subtext}
						</p>
					</div>
				</div>
			</div>
			<div className="absolute right-0 lg:right-8 bottom-0 h-[90%] md:h-[110%]">
				<Image
					src={imageSrc}
					alt={imageAlt ?? title}
					className="h-full w-auto object-contain scale-x-80 md:scale-x-90"
					width={imageWidth}
					height={imageHeight}
				/>
			</div>
		</div>
	);
};

const Investment = () => {
	return (
		<div className="container-default bg-white">
			<div className="flex justify-between items-center">
				<div className="flex gap-2 items-center">
					<span className="font-semibold text-base">Investment Products</span>
					<Image src={"/icons/Non-categorized.svg"} alt="icon" width={16} height={16} />
				</div>
				<div className="">
					<Link
						href={ENDPOINT.CGSI_EVENTS}
						className="text-enhanced-blue text-xs md:text-sm font-normal"
						target="_blank"
					>
						View All
					</Link>
				</div>
			</div>

			<div className="mt-6 flex gap-4 justify-between">
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
