"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BUTTON_WAIT_TIMEOUT_MS = 5000;

interface S2BPayButtonProps {
	s2bPayUrl: string;
	corpId: string;
	encStr: string;
	buttonText?: string;
	buttonHeight?: number;
	buttonWidth?: number;
	onClose?: () => void;
	onError?: () => void;
}

export function S2BPayButton({
	s2bPayUrl,
	corpId,
	encStr,
	buttonText = "Agree",
	buttonHeight = 30,
	buttonWidth = 80,
	onClose,
	onError,
}: S2BPayButtonProps) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const dialogSlotRef = React.useRef<HTMLDivElement>(null);
	const [showResponse, setShowResponse] = React.useState(false);

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
				const btn = container.querySelector<HTMLElement>(
					"button, a, input[type='button'], input[type='submit']"
				);
				if (btn) {
					clearTimeout(timeout);
					observer.disconnect();
					btn.click();
					setShowResponse(true);
				}
			});

			observer.observe(container, { childList: true, subtree: true });
		};

		script.onerror = () => onError?.();

		containerRef.current.appendChild(script);
	}, [s2bPayUrl, corpId, encStr, buttonText, buttonHeight, buttonWidth, onError]);

	// Move the S2B content into the dialog once it opens
	React.useEffect(() => {
		if (showResponse && containerRef.current && dialogSlotRef.current) {
			const slot = dialogSlotRef.current;
			const container = containerRef.current;
			// Move all child nodes into the dialog slot
			while (container.firstChild) {
				slot.appendChild(container.firstChild);
			}
		}
	}, [showResponse]);

	return (
		<>
			{/* Hidden container where S2B script loads and button gets auto-clicked */}
			<div ref={containerRef} className="overflow-hidden max-h-0" />

			{/* Dialog opens only after auto-click, showing the S2B response */}
			{showResponse && (
				<Dialog open onOpenChange={(open) => !open && onClose?.()}>
					<DialogContent className="sm:max-w-[530px] p-0 gap-0">
						<DialogHeader className="p-6 pb-4">
							<DialogTitle className="text-base font-semibold text-typo-primary text-left">
								PayNow
							</DialogTitle>
						</DialogHeader>
						<div ref={dialogSlotRef} className="px-6 pb-6 w-full" />
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
