"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";
import Campaigns from "./_component/Campaigns";
import Events from "./_component/Events";
import Investment from "./_component/Investment";
import ProductInformation from "./_component/ProductInformation";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

function HomeContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isAuthenticating, setIsAuthenticating] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleAuth = async () => {
			try {
				// Check if already authenticated
				if (authService.isAuthenticated()) {
					setIsAuthenticating(false);
					return;
				}

				// Get code from URL
				let code = searchParams.get("code");

				// If no code in URL, prompt for manual input (dev mode)
				if (!code) {
					code = window.prompt(
						"Enter authorization code:\n\n(In production, this will come from the redirect URL automatically)"
					);

					if (!code) {
						setError("Authorization code is required");
						setIsAuthenticating(false);
						return;
					}
				}

				await authService.exchangeCode(code, "http://localhost:8080/authorize");


				setIsAuthenticating(false);
			} catch (err) {
				console.error("Auth error:", err);
				setError(err instanceof Error ? err.message : "Authentication failed");
				setIsAuthenticating(false);
			}
		};

		handleAuth();
	}, [searchParams, router]);

	if (isAuthenticating) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cgs-blue mx-auto mb-4"></div>
					<p className="text-typo-secondary">Authenticating...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<ErrorState
					type="error"
					title="Authentication Error"
					description="We are unable to authenticate your session. Please try again later."
				/>
			</div>
		);
	}

	return (
		<div className="">
			<Campaigns />
			<div className="py-6 md:py-12">
				<Investment />
			</div>
			<Events />

			<ProductInformation />
		</div>
	);
}

export default function Home() {
	return (
		<Suspense
			fallback={
				<div className="container-default space-y-6 py-6">
					<Skeleton className="h-48 w-full" />
					<Skeleton className="h-64 w-full" />
					<Skeleton className="h-48 w-full" />
				</div>
			}
		>
			<HomeContent />
		</Suspense>
	);
}
