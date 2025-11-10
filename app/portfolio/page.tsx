import React from "react";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const DevelopmentBanner = () => {
	return (
		<div className="bg-white shadow-[0px_3px_16px_0px_rgba(0,108,235,0.20)] px-4 py-3 border-b rounded-lg w-full">
			<div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3 sm:gap-4 mx-auto max-w-screen-2xl">
				<div className="flex items-center gap-2">
					<TriangleAlert className="flex-shrink-0 w-4 h-4 text-yellow-600" />
					<p className="font-normal text-typo-primary text-sm">
						Page under development. Image view only.
					</p>
				</div>
				<div className="flex items-center gap-3 sm:gap-4">
					<Separator
						orientation="vertical"
						className="hidden sm:block bg-stroke-secondary w-[1px] h-6"
					/>
					<Button
						variant="link"
						className="p-0 h-auto font-normal text-enhanced-blue text-sm whitespace-nowrap"
					>
						Check FX Rate
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="bg-white hover:bg-enhanced-blue/5 border-enhanced-blue hover:border-enhanced-blue/80 h-7 text-enhanced-blue hover:text-enhanced-blue/80 whitespace-nowrap"
					>
						View Details
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
