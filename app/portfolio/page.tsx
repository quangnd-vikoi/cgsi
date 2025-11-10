import React from "react";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const DevelopmentBanner = () => {
	return (
		<div className="shadow-[0px_3px_16px_0px_rgba(0,108,235,0.20)] px-4 py-3 border-b rounded-lg w-full">
			<div className="flex justify-between items-center mx-auto max-w-screen-2xl">
				<div className="flex items-center gap-2">
					<TriangleAlert className="w-4 h-4 text-yellow-600" />
					<p className="font-normal text-typo-primary text-sm">
						Page under development. Image view only.
					</p>
				</div>
				<div className="flex items-center gap-4">
					<Separator orientation="vertical" className="w-2 h-6 text-typo-secondary" />
					<Button variant="link" className="p-0 h-auto font-normal text-enhanced-blue text-sm">
						Check FX Rate
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="bg-white border-enhanced-blue hover:border-enhanced-blue/80 h-7 text-en text-enhanced-blue hover:text-enhanced-blue/80"
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
		<div className="py-6">
			<div className="container-default">
				<DevelopmentBanner />

				{/* Demo1 */}

				<Image
					src="/images/portfolio/p-demo-1.png"
					alt="Demo1"
					width={1280}
					height={720}
					className="mt-6"
				/>

				<Image
					src="/images/portfolio/p-demo-2.png"
					alt="Demo2"
					width={1280}
					height={720}
					className="mt-6"
				/>

				<Image
					src="/images/portfolio/p-demo-3.png"
					alt="Demo3"
					width={1280}
					height={720}
					className="mt-6"
				/>
			</div>
		</div>
	);
};

export default Portfolio;
