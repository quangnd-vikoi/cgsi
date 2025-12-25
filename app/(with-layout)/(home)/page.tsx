"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";
import Campaigns from "./_component/Campaigns";
import Events from "./_component/Events";
import Investment from "./_component/Investment";
import ProductInformation from "./_component/ProductInformation";

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

				// Exchange code for tokens
				// Note: redirectUri must match the URI registered with SSO server
				await authService.exchangeCode(code, "http://localhost:8080/authorize");

				// Store token in cookie for middleware
				document.cookie = `accessToken=${authService.getAccessToken()}; path=/; max-age=3600`;

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
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-enhanced-blue mx-auto mb-4"></div>
					<p className="text-typo-secondary">Authenticating...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center max-w-md">
					<h1 className="text-2xl font-bold text-status-error mb-4">Authentication Error</h1>
					<p className="text-typo-secondary mb-6">{error}</p>
					<button
						onClick={() => {
							setError(null);
							setIsAuthenticating(true);
							window.location.reload();
						}}
						className="px-6 py-2 bg-enhanced-blue text-white rounded-lg hover:opacity-90"
					>
						Try Again
					</button>
				</div>
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
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-enhanced-blue mx-auto mb-4"></div>
						<p className="text-typo-secondary">Loading...</p>
					</div>
				</div>
			}
		>
			<HomeContent />
		</Suspense>
	);
}
