"use client";

import React from "react";
import { Loader2 } from "lucide-react";
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
	const [phase, setPhase] = React.useState<"loading" | "ready" | "error">("loading");

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
				setPhase("error");
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
					setPhase("ready");
				}
			});

			observer.observe(container, { childList: true, subtree: true });
		};

		script.onerror = () => {
			setPhase("error");
			onError?.();
		};

		containerRef.current.appendChild(script);
	}, [s2bPayUrl, corpId, encStr, buttonText, buttonHeight, buttonWidth, onError]);

	const handleClose = () => {
		onClose?.();
	};

	return (
		<Dialog open onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="sm:max-w-[530px] p-0 gap-0">
				<DialogHeader className="p-6 pb-4">
					<DialogTitle className="text-base font-semibold text-typo-primary text-left">
						PayNow
					</DialogTitle>
				</DialogHeader>

				<div className="px-6 pb-6 min-h-[200px] flex flex-col items-center justify-center">
					{phase === "loading" && (
						<div className="flex flex-col items-center gap-3 text-typo-secondary">
							<Loader2 className="h-8 w-8 animate-spin text-cgs-blue" />
							<p className="text-sm">Preparing payment...</p>
						</div>
					)}

					{phase === "error" && (
						<p className="text-sm text-status-error">
							Unable to launch PayNow. Please close and try again.
						</p>
					)}

					{/* S2B script renders QR code here after auto-click */}
					<div
						ref={containerRef}
						className={phase === "ready" ? "w-full" : "absolute opacity-0 pointer-events-none"}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
