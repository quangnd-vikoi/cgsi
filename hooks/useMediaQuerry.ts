"use client";
import { useState, useEffect } from "react";

type DeviceType = "mobile" | "tablet" | "laptop" | "desktop";

const BREAKPOINTS: Record<DeviceType, string> = {
	mobile: "(max-width: 767px)",
	tablet: "(min-width: 768px) and (max-width: 1023px)",
	laptop: "(min-width: 1024px) and (max-width: 1439px)",
	desktop: "(min-width: 1440px)",
} as const;

export function useMediaQuery(device: DeviceType): boolean {
	const query = BREAKPOINTS[device];
	const [matches, setMatches] = useState<boolean>(false);
	const [mounted, setMounted] = useState<boolean>(false);

	useEffect(() => {
		setMounted(true);

		const media = window.matchMedia(query);
		setMatches(media.matches);

		const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
		media.addEventListener("change", listener);

		return () => media.removeEventListener("change", listener);
	}, [query]);

	return mounted ? matches : false;
}
