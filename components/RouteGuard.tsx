"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useUserTypeStore } from "@/stores/userTypeStore";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { isAuthenticated, redirectToLogin } from "@/lib/services/authService";
import { ROUTE_ACCESS } from "@/constants/accessControl";

export function RouteGuard({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const userType = useUserTypeStore((state) => state.userType);
	const isInitialized = useTradingAccountStore((state) => state.isInitialized);

	// SSO exception: let OAuth callback through without any checks
	if (pathname === "/" && searchParams.has("code")) {
		return <>{children}</>;
	}

	// Auth check
	if (!isAuthenticated()) {
		redirectToLogin();
		return null;
	}

	// Strip query string for route lookup
	const accessRule = ROUTE_ACCESS[pathname];

	// null or not in map → allowed for all authenticated users, render immediately
	if (accessRule === null || accessRule === undefined) {
		return <>{children}</>;
	}

	// Type-restricted route: render children underneath a white overlay while checking
	const isChecking = !isInitialized;
	const isAllowed = isInitialized && userType !== null && accessRule.includes(userType);

	if (isInitialized && !isAllowed) {
		router.replace("/unauthorized");
		return null;
	}

	return (
		<>
			{isChecking && (
				<div className="fixed inset-0 z-[999] bg-white flex items-center justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
				</div>
			)}
			{children}
		</>
	);
}
