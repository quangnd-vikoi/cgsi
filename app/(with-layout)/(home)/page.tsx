"use client";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";
import Campaigns from "./_component/Campaigns";
import Events from "./_component/Events";
import Investment from "./_component/Investment";
import ProductInformation from "./_component/ProductInformation";
import { ErrorState } from "@/components/ErrorState";
import HomePageSkeleton from "./_component/skeletons/HomePageSkeleton";
import { prefetchCampaigns } from "./_component/campaignsPrefetch";

function HomeContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isAuthenticating, setIsAuthenticating] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const authInProgress = useRef(false);

	// Runs synchronously before the first browser paint — no hydration mismatch,
	// no visible skeleton flash for authenticated users.
	useLayoutEffect(() => {
		const hasCode = new URLSearchParams(window.location.search).get("code");
		if (!hasCode && authService.isAuthenticated()) {
			setIsAuthenticating(false);
		}
	}, []);

	useEffect(() => {
		prefetchCampaigns(); // public API — start fetch immediately
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
		return <HomePageSkeleton />;
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
		<Suspense fallback={<HomePageSkeleton />}>
			<HomeContent />
		</Suspense>
	);
}
