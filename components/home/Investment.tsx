"use client";
import { ENDPOINT } from "@/constants/endpoint";
import { useMediaQuery } from "@/hooks/useMediaQuerry";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type InvestmentCardProps = {
	title: string;
	available?: number | string;
	imageSrc: string;
	subtext: string;
	imageAlt?: string;
	imageWidth?: number;
	imageHeight?: number;
};

const InvestmentCard: React.FC<InvestmentCardProps> = ({
	title,
	available = 0,
	imageSrc,
	subtext,
	imageAlt,
	imageWidth = 110,
	imageHeight = 125,
}) => {
	const isMobile = useMediaQuery("mobile");

	return (
		<div
			className="relative rounded-lg bg-gradient-to-br from-white via-blue-50 to-white shadow-sm w-full"
			style={{
				backgroundImage:
					"linear-gradient(135deg, white 0%, white 25%, rgb(240, 248, 255) 50%, white 75%, white 100%)",
			}}
		>
			<div className="relative rounded-lg w-full">
				<div
					className="overflow-hidden rounded-lg bg-gradient-to-br from-white via-blue-50 to-white shadow-sm"
					style={{
						backgroundImage:
							"linear-gradient(90deg, white 0%, #f6fbff 20%, #d9edff 50%, #f6fbff 80%, white 100%)",
					}}
				>
					<div className="pl-6 pt-5 pb-4 w-2/3">
						<div className="flex flex-col md:flex-row items-baseline gap-4 mb-2">
							<h2 className="text-lg font-semibold text-enhanced-blue">{title}</h2>
							<span className="text-sm text-typo-tertiary">
								{available != 0 ? `${available} Available` : "No Available"}
							</span>
						</div>
						<p
							hidden={isMobile}
							className="text-typo-tertiary leading-relaxed text-sm max-w-[70%] lg:max-w-[90%]"
							style={{
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
							}}
						>
							{subtext}
						</p>
					</div>
				</div>
			</div>
			<div className="absolute right-3 lg:right-8 bottom-0 h-[90%] md:h-[110%]">
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
		<div className="container-default h-[155px] bg-white">
			<div className="flex justify-between items-center">
				<div className="flex gap-2 items-center">
					<span className="font-semibold text-lg">Investment Products</span>
					<Image src={"/icons/Non-categorized.svg"} alt="icon" width={16} height={16} />
				</div>
				<div className="">
					<Link
						href={ENDPOINT.CGSI_EVENTS}
						className="text-enhanced-blue text-sm font-normal"
						target="_blank"
					>
						View All
					</Link>
				</div>
			</div>

			<div className="mt-6 flex gap-4 justify-between">
				<InvestmentCard
					title="Securities"
					available={1}
					imageSrc="/icons/Investment-left.svg"
					subtext="Tap into exclusive investment opportunities, from shares at initial offering prices (IOPs) to IPOs"
				/>

				<InvestmentCard
					title="Alternatives"
					available={0}
					imageSrc="/icons/Investment-right.png"
					subtext="Diversify with curated funds that match different risk profiles and investment horizons"
				/>
			</div>
		</div>
	);
};

export default Investment;
