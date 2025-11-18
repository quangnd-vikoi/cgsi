import React from "react";
import HomeStock from "@/public/icons/home-stock.svg";
import HomeChart from "@/public/icons/home-chart.svg";
import HomeCareer from "@/public/icons/home-career.svg";
import HomeCountry from "@/public/icons/home-country.svg";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const PRODUCT_ITEMS = [
	{
		icons: <HomeStock className="text-enhanced-blue" />,
		label: "Stock",
		href: "#",
		mobileIcon: <HomeStock className="text-icon-light" />,
	},
	{
		icons: <HomeChart className="text-enhanced-blue" />,
		label: "Margin Financing",
		href: "#",
		mobileIcon: <HomeChart className="text-icon-light" />,
	},
	{
		icons: <HomeCareer className="text-enhanced-blue" />,
		label: "Shares Borrowing & Lending",
		href: "#",
		mobileIcon: <HomeCareer className="text-icon-light" />,
	},
	{
		icons: <HomeCountry className="text-enhanced-blue" />,
		label: "Shariah-Compliant Investment Products",
		href: "#",
		mobileIcon: <HomeCountry className="text-icon-light" />,
	},
];

const ProductInformation = () => {
	return (
		<div className="container-default py-6 md:py-12">
			<div className="flex items-center gap-2">
				<span className="hidden md:inline font-semibold text-base">Product Offering & Services</span>
				<span className="md:hidden font-semibold text-base">Product Information</span>
				<Image
					src={"/icons/Warning.svg"}
					alt="icon"
					width={16}
					height={16}
					className="hidden md:inline"
				/>
			</div>

			{/* Table menu */}
			<div className="hidden md:flex justify-between items-center mt-6 gap-6">
				{PRODUCT_ITEMS.map((item, index) => {
					return (
						<div
							key={index}
							className="group w-1/4 flex gap-4 p-4 items-center border border-stroke-secondary rounded-lg shadow-[0px_2px_16.299999237060547px_-1px_rgba(33,64,154,0.10)] cursor-pointer hover:border-enhanced-blue"
						>
							<div className="flex-0">{item.icons}</div>

							<p
								className="truncate text-sm font-normal text-typo-secondary 
          group-hover:text-enhanced-blue group-hover:font-bold"
							>
								{item.label}
							</p>
						</div>
					);
				})}
			</div>

			{/* Mobile Menu */}

			<div className="border border-stroke-secondary rounded-lg mt-6 md:hidden">
				{PRODUCT_ITEMS.map((item, index) => {
					return (
						<Link href={item.href} key={index} className="flex p-4 items-center justify-between">
							<div className="flex gap-4 min-w-0">
								<div className="flex-none">{item.mobileIcon}</div>
								<p className="truncate text-sm font-normal text-typo-secondary">
									{item.label}
								</p>
							</div>

							<ChevronRight className="flex-none text-enhanced-blue" size={20} />
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default ProductInformation;
