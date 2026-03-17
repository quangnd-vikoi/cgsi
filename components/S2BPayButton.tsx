"use client";

import React from "react";

const BUTTON_WAIT_TIMEOUT_MS = 5000;

declare global {
	interface Window {
		s2bPayClose?: (status: { status: string; corpref: string }) => void;
	}
}

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

	// Stable refs so the effect doesn't re-run when callbacks change
	const onReadyRef = React.useRef(onReady);
	const onCloseRef = React.useRef(onClose);
	const onErrorRef = React.useRef(onError);
	onReadyRef.current = onReady;
	onCloseRef.current = onClose;
	onErrorRef.current = onError;

	React.useEffect(() => {
		let cancelled = false;

		// Official S2B callback — called when user closes lightbox without selecting payment method
		// Used as primary close signal; MutationObserver below is the fallback
		let closeFired = false;
		const fireClose = () => {
			if (closeFired || cancelled) return;
			closeFired = true;
			onCloseRef.current?.();
		};
		window.s2bPayClose = (status) => {
			if (status.status === "closed") fireClose();
		};

		(async () => {
			const data = await submitFn();
			if (cancelled) return;

			if (!data) {
				onErrorRef.current?.();
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
					if (!cancelled) onErrorRef.current?.();
				}, BUTTON_WAIT_TIMEOUT_MS);

				const agreeObserver = new MutationObserver(() => {
					const btn = container.querySelector<HTMLElement>("#s2bpay-button");
					if (!btn) return;

					clearTimeout(timeout);
					agreeObserver.disconnect();

					let lightboxAppeared = false;
					let readyFired = false;

					const hasS2BLightbox = () =>
						document.querySelector(
							"#s2bpayv2-s2bpay-lightbox-container, #s2bpay-lightbox-container, #s2bpay-lightbox"
						);

					let closeDebounce: ReturnType<typeof setTimeout> | null = null;

					// Watch for lightbox appearance (onReady) and disappearance (fallback onClose)
					const lightboxObserver = new MutationObserver(() => {
						const lightbox = hasS2BLightbox();

						if (lightbox) {
							lightboxAppeared = true;
							// Cancel any pending close — lightbox reappeared (v1 step transition)
							if (closeDebounce) {
								clearTimeout(closeDebounce);
								closeDebounce = null;
							}
							if (!readyFired && !cancelled) {
								readyFired = true;
								onReadyRef.current?.();
							}
						} else if (lightboxAppeared) {
							// Debounce: v1 briefly removes lightbox between steps
							if (!closeDebounce) {
								closeDebounce = setTimeout(() => {
									if (!hasS2BLightbox()) {
										lightboxObserver.disconnect();
										fireClose();
									}
									closeDebounce = null;
								}, 500);
							}
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
						setTimeout(tryClick, CLICK_RETRY_INTERVAL_MS);
					};
					setTimeout(tryClick, 500);
				});

				agreeObserver.observe(container, { childList: true, subtree: true });
			};

			script.onerror = () => {
				if (!cancelled) onErrorRef.current?.();
			};

			container.appendChild(script);
		})();

		return () => {
			cancelled = true;
			delete window.s2bPayClose;
		};
	}, [submitFn]);

	return <div ref={containerRef} className="fixed z-[9999] opacity-0 pointer-events-none" />;
}
