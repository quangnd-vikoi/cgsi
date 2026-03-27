"use client";

import { useRouter } from "next/navigation";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
	const router = useRouter();

	return (
		<div className="min-h-svh flex items-center justify-center bg-gradient-to-br from-background-section via-white to-theme-blue-09 pad relative overflow-hidden">
			{/* Decorative background elements */}
			<div className="absolute top-0 right-0 w-96 h-96 bg-theme-blue-085/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
			<div className="absolute bottom-0 left-0 w-80 h-80 bg-theme-blue-085/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

			<div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-2xl">
				{/* Icon */}
				<div className="shrink-0 flex items-center justify-center">
					<ShieldX className="h-28 w-28 md:h-44 md:w-44 text-cgs-blue" strokeWidth={1} />
				</div>

				{/* Content */}
				<div className="space-y-4 text-center md:text-left max-w-lg">
					<h1 className="text-3xl font-bold text-typo-primary tracking-tight">
						Access Denied
					</h1>
					<p className="text-typo-secondary leading-relaxed">
						You do not have permission to access this page. If you believe this is an
						error, please contact your trading representative for assistance.
					</p>

					<Button
						onClick={() => router.push("/")}
						className="bg-cgs-blue hover:bg-cgs-blue/90 h-11 px-6 rounded-lg gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Return to Home
					</Button>
				</div>
			</div>
		</div>
	);
}
