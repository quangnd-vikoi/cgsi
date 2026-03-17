"use client";

import React from "react";

const BUTTON_WAIT_TIMEOUT_MS = 5000;

interface S2BPayButtonProps {
	submitFn: () => Promise<{ s2bPayUrl: string; corpId: string; encStr: string } | null>;
	onReady?: () => void;
	onClose?: () => void;
	onError?: () => void;
}

/** Auto-click the S2B button using native .click() */
function autoClick(el: HTMLElement) {
	el.click();
}

export function S2BPayButton({ submitFn, onReady, onClose, onError }: S2BPayButtonProps) {
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

				const agreeObserver = new MutationObserver(() => {
					const btn = container.querySelector<HTMLElement>("#s2bpay-button");
					if (!btn) return;

					clearTimeout(timeout);
					agreeObserver.disconnect();

					// Set up lightbox observer before clicking so we don't miss the event
					let lightboxAppeared = false;
					const lightboxObserver = new MutationObserver(() => {
						const lightbox = document.querySelector(
							"#s2bpayv2-s2bpay-lightbox-container, #s2bpay-lightbox-container"
						);
						if (lightbox) {
							lightboxAppeared = true;
						} else if (lightboxAppeared) {
							lightboxObserver.disconnect();
							if (!cancelled) onClose?.();
						}
					});
					lightboxObserver.observe(document.body, { childList: true, subtree: true });

					// Retry clicking until the lightbox appears or max attempts reached
					const MAX_CLICK_ATTEMPTS = 5;
					const CLICK_RETRY_INTERVAL_MS = 300;
					let attempts = 0;

					const tryClick = () => {
						if (cancelled || lightboxAppeared || attempts >= MAX_CLICK_ATTEMPTS) return;
						attempts++;
						btn.style.pointerEvents = "none";
						autoClick(btn);
						// Notify caller after first click so loading state can clear
						if (attempts === 1 && !cancelled) onReady?.();
						setTimeout(tryClick, CLICK_RETRY_INTERVAL_MS);
					};
					setTimeout(tryClick, 200);
				});

				agreeObserver.observe(container, { childList: true, subtree: true });
			};

			script.onerror = () => {
				if (!cancelled) onError?.();
			};

			container.appendChild(script);
		})();

		return () => { cancelled = true; };
	}, [submitFn, onReady, onClose, onError]);

	return <div ref={containerRef} className="fixed z-[9999] opacity-0 pointer-events-none" />;
}
