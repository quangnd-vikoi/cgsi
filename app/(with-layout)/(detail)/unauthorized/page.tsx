"use client";

import { useRouter } from "next/navigation";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
	const router = useRouter();

	return (
		<div className="flex-1 flex items-center justify-center pad">
			<div className="text-center max-w-md space-y-6">
				<div className="flex justify-center">
					<div className="rounded-full bg-status-error/10 p-4">
						<ShieldX className="h-12 w-12 text-status-error" />
					</div>
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-semibold text-typo-primary">Access Denied</h1>
					<p className="text-typo-secondary">
						You do not have permission to access this page. If you believe this is an
						error, please contact your trading representative for assistance.
					</p>
				</div>

				<Button onClick={() => router.push("/")} className="bg-cgs-blue hover:bg-cgs-blue/90">
					Return to Home
				</Button>
			</div>
		</div>
	);
}
