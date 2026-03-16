"use client";

import React from "react";

const BUTTON_WAIT_TIMEOUT_MS = 5000;

interface S2BPayButtonProps {
	submitFn: () => Promise<{ s2bPayUrl: string; corpId: string; encStr: string } | null>;
	onClose?: () => void;
	onError?: () => void;
}

/** Simulate a full user click sequence on an element */
function simulateClick(el: HTMLElement) {
	const opts = { bubbles: true, cancelable: true, view: window };
	el.dispatchEvent(new PointerEvent("pointerdown", opts));
	el.dispatchEvent(new MouseEvent("mousedown", opts));
	el.dispatchEvent(new PointerEvent("pointerup", opts));
	el.dispatchEvent(new MouseEvent("mouseup", opts));
	el.dispatchEvent(new MouseEvent("click", opts));
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

				const agreeObserver = new MutationObserver(() => {
					const btn = container.querySelector<HTMLElement>("#s2bpay-button");
					if (!btn) return;

					clearTimeout(timeout);
					agreeObserver.disconnect();

					// Simulate full click sequence for S2B v2 compatibility
					simulateClick(btn);

					// Watch for lightbox to appear then disappear
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

	return <div ref={containerRef} className="fixed z-[9999] opacity-0 pointer-events-none" />;
}
