import React from "react";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "@/components/Image";

const DevelopmentBanner = () => {
	return (
		<div className="bg-white shadow-[0px_3px_16px_0px_rgba(0,108,235,0.20)] px-4 py-3 border-b rounded-lg w-full">
			<div className="flex flex-wrap justify-between items-center gap-3 mx-auto max-w-screen-2xl">
				<div className="flex items-center gap-2">
					<AlertCircle className="flex-shrink-0 w-4 h-4 text-enhanced-blue" />
					<p className="font-normal text-typo-primary text-sm">
						Information herein is updated only up to the last business day and should not be relied upon in any way.
					</p>
				</div>

				<Separator
					orientation="horizontal"
					className="block md:hidden bg-stroke-secondary h-[1px] w-full"
				/>

				<div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
					{/* Vertical separator trên desktop - dùng div */}
					<div className="hidden md:block bg-stroke-secondary w-[2px] h-6 self-stretch" />

					<Button
						variant="link"
						className="flex-1 md:flex-none p-0 h-auto font-normal text-enhanced-blue text-sm whitespace-nowrap gap-1"
					>
						<Image src={"/icons/portfolio/dollar-sign.svg"} className="hidden md:block" alt="FX Rate" width={20} height={20} />
						View FX Rate
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="flex-1 md:flex-none bg-white hover:bg-enhanced-blue/5 border-enhanced-blue hover:border-enhanced-blue/80 h-7 text-enhanced-blue hover:text-enhanced-blue/75 whitespace-nowrap"
					>
						Learn More
					</Button>
				</div>

			</div>
		</div>
	);
};

const Portfolio = () => {
	return (
		<div className="bg-background-section py-6">
			<div className="container-default">
				<DevelopmentBanner />

				{/* Demo Images */}
				<div className="flex flex-col gap-6 mt-6">
					<Image
						src="/images/portfolio/p-demo-1.png"
						alt="Portfolio Demo 1"
						width={1280}
						height={720}
						className="rounded-lg w-full h-auto"
						quality={90}
					/>

					<Image
						src="/images/portfolio/p-demo-2.png"
						alt="Portfolio Demo 2"
						width={1280}
						height={720}
						className="rounded-lg w-full h-auto"
						quality={90}
					/>

					<Image
						src="/images/portfolio/p-demo-3.png"
						alt="Portfolio Demo 3"
						width={1280}
						height={720}
						className="rounded-lg w-full h-auto"
						quality={90}
					/>
				</div>
			</div>
		</div>
	);
};

export default Portfolio;
