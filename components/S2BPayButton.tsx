"use client";

import React from "react";
import { Loader2 } from "lucide-react";

const BUTTON_WAIT_TIMEOUT_MS = 5000;

interface S2BPayButtonProps {
	s2bPayUrl: string;
	corpId: string;
	encStr: string;
	buttonText?: string;
	buttonHeight?: number;
	buttonWidth?: number;
	onAutoClick?: () => void;
	onError?: () => void;
}

export function S2BPayButton({
	s2bPayUrl,
	corpId,
	encStr,
	buttonText = "Agree",
	buttonHeight = 30,
	buttonWidth = 80,
	onAutoClick,
	onError,
}: S2BPayButtonProps) {
	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (!containerRef.current) return;

		containerRef.current.innerHTML = "";

		const script = document.createElement("script");
		script.id = "s2bpay-button-script";
		script.className = "s2bpay-button";
		script.src = s2bPayUrl;
		script.setAttribute("data-corpid", corpId);
		script.setAttribute("data-encstr", encStr);
		script.setAttribute("data-s2bpay-button-text", buttonText);
		script.setAttribute("data-s2bpay-button-height", String(buttonHeight));
		script.setAttribute("data-s2bpay-button-width", String(buttonWidth));

		script.onload = () => {
			const container = containerRef.current;
			if (!container) return;

			const timeout = setTimeout(() => {
				observer.disconnect();
				onError?.();
			}, BUTTON_WAIT_TIMEOUT_MS);

			const observer = new MutationObserver(() => {
				const btn = container.querySelector<HTMLElement>("button, a, input[type='button'], input[type='submit']");
				if (btn) {
					clearTimeout(timeout);
					observer.disconnect();
					btn.click();
					onAutoClick?.();
				}
			});

			observer.observe(container, { childList: true, subtree: true });
		};

		script.onerror = () => onError?.();

		containerRef.current.appendChild(script);
	}, [s2bPayUrl, corpId, encStr, buttonText, buttonHeight, buttonWidth, onAutoClick, onError]);

	return <div ref={containerRef} className="hidden" />;
}
