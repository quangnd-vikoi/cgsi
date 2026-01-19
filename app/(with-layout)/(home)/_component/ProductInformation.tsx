import HomeStock from "@/public/icons/home-stock.svg";
import HomeChart from "@/public/icons/home-chart.svg";
import HomeCareer from "@/public/icons/home-career.svg";
import HomeCountry from "@/public/icons/home-country.svg";
import Image from "@/components/Image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
const PRODUCT_ITEMS = [
	{
		icons: <HomeStock className="text-icon-light group-hover:text-cgs-blue transition-colors" />,
		label: "Stock",
		href: "#",
	},
	{
		icons: <HomeChart className="text-icon-light group-hover:text-cgs-blue transition-colors" />,
		label: "Margin Financing",
		href: "#",
	},
	{
		icons: <HomeCareer className="text-icon-light group-hover:text-cgs-blue transition-colors" />,
		label: "Shares Borrowing & Lending",
		href: "#",
	},
	{
		icons: <HomeCountry className="text-icon-light group-hover:text-cgs-blue transition-colors" />,
		label: "Shariah-Compliant Investment Products",
		href: "#",
	},
];
const ProductInformation = () => {
	return (
		<div className="container-default py-6 md:py-12">
			<div className="flex items-center gap-2">
				<span className="hidden md:inline font-semibold text-base">Explore Products</span>
			</div>

			{/* Table menu */}
			<div className="hidden md:flex justify-between mt-6 gap-6 items-stretch">
				{PRODUCT_ITEMS.map((item, index) => {
					return (
						<div
							key={index}
							className="group w-1/4 flex gap-4 p-6 items-center border border-stroke-secondary rounded hover:shadow-[0px_2px_16.299999237060547px_-1px_rgba(33,64,154,0.10)] cursor-pointer hover:border-cgs-blue justify-between min-w-0"
						>
							<div className="flex gap-5 items-center min-w-0 overflow-hidden">
								<div className="flex-none">{item.icons}</div>

								<p
									className="text-sm font-medium text-typo-secondary group-hover:text-cgs-blue  truncate"
								>
									{item.label}
								</p>
							</div>
							<ChevronRight className="flex-none text-cgs-blue" size={20} />
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
								<div className="flex-none">{item.icons}</div>
								<p className="truncate text-sm font-normal text-typo-secondary">
									{item.label}
								</p>
							</div>

							<ChevronRight className="flex-none text-cgs-blue" size={20} />
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default ProductInformation;
