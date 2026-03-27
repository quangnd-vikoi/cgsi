"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useRoutePermission } from "@/hooks/usePermission";

function LoadingOverlay() {
	return (
		<div className="fixed inset-0 z-[200] bg-white flex items-center justify-center gap-2">
			{[0, 1, 2].map((i) => (
				<span
					key={i}
					className="h-2.5 w-2.5 rounded-full bg-cgs-blue"
					style={{
						animation: "dot-breathing 1.4s ease-in-out infinite",
						animationDelay: `${i * 0.2}s`,
					}}
				/>
			))}
		</div>
	);
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();

	// Check for SSO callback using window.location to avoid Suspense boundary issues
	const [isSSOCallback, setIsSSOCallback] = useState(false);
	useEffect(() => {
		if (pathname === "/" && window.location.search.includes("code=")) {
			setIsSSOCallback(true);
		} else {
			setIsSSOCallback(false);
		}
	}, [pathname]);

	const { isLoading, isAllowed } = useRoutePermission(pathname);

	// SSO callback always allowed, skip guard entirely
	const allowed = isSSOCallback || isAllowed;

	useEffect(() => {
		if (!isLoading && !allowed) {
			router.replace("/unauthorized");
		}
	}, [isLoading, allowed, router]);

	// Loading: show full-screen white overlay with spinner
	if (isLoading) {
		return (
			<>
				{children}
				<LoadingOverlay />
			</>
		);
	}

	// Denied: show white overlay while redirecting
	if (!allowed) {
		return (
			<>
				{children}
				<LoadingOverlay />
			</>
		);
	}

	// Allowed: render normally
	return <>{children}</>;
}
