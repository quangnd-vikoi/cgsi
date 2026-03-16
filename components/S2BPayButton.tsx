"use client";

import React from "react";

const BUTTON_WAIT_TIMEOUT_MS = 5000;

interface S2BPayButtonProps {
	submitFn: () => Promise<{ s2bPayUrl: string; corpId: string; encStr: string } | null>;
	onClose?: () => void;
	onError?: () => void;
	/** When false, show the S2B button visibly for manual click instead of auto-clicking */
	autoClick?: boolean;
}

export function S2BPayButton({ submitFn, onClose, onError, autoClick = true }: S2BPayButtonProps) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		let cancelled = false;

		(async () => {
			console.log("[S2B] Calling submitFn...");
			const data = await submitFn();
			console.log("[S2B] submitFn result:", data);
			if (cancelled) return;

			if (!data) {
				console.error("[S2B] No data returned — API failed");
				onError?.();
				return;
			}

			const container = containerRef.current;
			if (!container) {
				console.error("[S2B] Container ref is null");
				return;
			}

			container.innerHTML = "";

			const script = document.createElement("script");
			script.id = "s2bpay-button-script";
			script.className = "s2bpay-button";
			script.src = data.s2bPayUrl;
			script.setAttribute("data-corpid", data.corpId);
			script.setAttribute("data-encstr", data.encStr);
			script.setAttribute("data-s2bpay-button-text", "Agree");
			script.setAttribute("data-s2bpay-button-height", "30");
			script.setAttribute("data-s2bpay-button-width", "80");

			console.log("[S2B] Loading script from:", data.s2bPayUrl);

			script.onload = () => {
				console.log("[S2B] Script loaded, watching for #s2bpay-button...");
				if (cancelled || !container) return;

				const timeout = setTimeout(() => {
					console.error("[S2B] Timeout — #s2bpay-button not found after", BUTTON_WAIT_TIMEOUT_MS, "ms");
					observer.disconnect();
					if (!cancelled) onError?.();
				}, BUTTON_WAIT_TIMEOUT_MS);

				const observer = new MutationObserver(() => {
					const btn = container.querySelector<HTMLElement>("#s2bpay-button");
					if (btn) {
						clearTimeout(timeout);
						observer.disconnect();
						setLoading(false);

						if (autoClick) {
							console.log("[S2B] Found #s2bpay-button, auto-clicking...");
							btn.click();
							if (!cancelled) onClose?.();
						} else {
							console.log("[S2B] Found #s2bpay-button, waiting for manual click...");
						}
					}
				});

				observer.observe(container, { childList: true, subtree: true });
			};

			script.onerror = (err) => {
				console.error("[S2B] Script failed to load:", err);
				if (!cancelled) onError?.();
			};

			container.appendChild(script);
		})();

		return () => { cancelled = true; };
	}, [submitFn, onClose, onError, autoClick]);

	if (autoClick) {
		return <div ref={containerRef} className="overflow-hidden max-h-0" />;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full mx-4 text-center">
				<p className="text-sm font-semibold text-typo-primary mb-4">
					Click the button below to proceed with PayNow
				</p>
				<div ref={containerRef} className={loading ? "opacity-0 h-0" : "flex justify-center"} />
				{loading && (
					<p className="text-xs text-typo-secondary animate-pulse">Loading payment...</p>
				)}
				<button
					onClick={() => onClose?.()}
					className="mt-4 text-xs text-typo-secondary hover:text-typo-primary underline"
				>
					Cancel
				</button>
			</div>
		</div>
	);
}
