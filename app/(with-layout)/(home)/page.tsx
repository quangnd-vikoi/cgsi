"use client";
import { Suspense, useEffect, useRef, useState } from "react";
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
	const authInProgress = useRef(false);

	useEffect(() => {
		if (authInProgress.current) return;
		authInProgress.current = true;

		const handleAuth = async () => {
			try {
				// Always check for code from URL first (handles SSO callback)
				const code = searchParams.get("code");

				if (code) {
					// Exchange code for tokens
					await authService.exchangeCode(code, "http://localhost:8080/authorize");
					// Clean up URL by removing query parameters
					router.replace("/");
					setIsAuthenticating(false);
					return;
				}

				// No code in URL - check if already authenticated
				if (authService.isAuthenticated()) {
					setIsAuthenticating(false);
					return;
				}

				// Not authenticated and no code - redirect to login
				authService.redirectToLogin();
			} catch (err) {
				console.error("Auth error:", err);
				setError(err instanceof Error ? err.message : "Authentication failed");
				setIsAuthenticating(false);
			}
		};

		handleAuth();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

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
