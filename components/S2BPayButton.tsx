"use client";

import React from "react";

const BUTTON_WAIT_TIMEOUT_MS = 5000;

interface S2BPayButtonProps {
	submitFn: () => Promise<{ s2bPayUrl: string; corpId: string; encStr: string } | null>;
	onClose?: () => void;
	onError?: () => void;
}

export function S2BPayButton({ submitFn, onClose, onError }: S2BPayButtonProps) {
	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		let cancelled = false;

		(async () => {
			const data = await submitFn();
			if (cancelled) return;

			if (!data) {
				onError?.();
				return;
			}

			const container = containerRef.current;
			if (!container) return;

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

			script.onload = () => {
				if (cancelled || !container) return;

				const timeout = setTimeout(() => {
					agreeObserver.disconnect();
					if (!cancelled) onError?.();
				}, BUTTON_WAIT_TIMEOUT_MS);

				// Step 1: Watch for the "Agree" button, then auto-click it
				const agreeObserver = new MutationObserver(() => {
					const btn = container.querySelector<HTMLElement>("#s2bpay-button");
					if (btn) {
						clearTimeout(timeout);
						agreeObserver.disconnect();
						btn.click();

						// Step 2: Watch for the lightbox to be removed (user completes/closes payment)
						const lightboxObserver = new MutationObserver(() => {
							const lightbox = document.querySelector("#s2bpayv2-s2bpay-lightbox-container, #s2bpay-lightbox-container");
							if (!lightbox) {
								lightboxObserver.disconnect();
								if (!cancelled) onClose?.();
							}
						});

						// Observe document.body since lightbox may be appended at top level
						lightboxObserver.observe(document.body, { childList: true, subtree: true });
					}
				});

				agreeObserver.observe(container, { childList: true, subtree: true });
			};

			script.onerror = () => {
				if (!cancelled) onError?.();
			};

			container.appendChild(script);
		})();

		return () => { cancelled = true; };
	}, [submitFn, onClose, onError]);

	// Container must stay visible so the S2B lightbox can render
	return <div ref={containerRef} className="fixed z-[9999]" />;
}
