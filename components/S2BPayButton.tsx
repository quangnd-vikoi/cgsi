"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BUTTON_WAIT_TIMEOUT_MS = 5000;

interface S2BPayButtonProps {
	submitFn: () => Promise<{ s2bPayUrl: string; corpId: string; encStr: string } | null>;
	onClose?: () => void;
}

export function S2BPayButton({ submitFn, onClose }: S2BPayButtonProps) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");
	const [errorMsg, setErrorMsg] = React.useState("");

	React.useEffect(() => {
		let cancelled = false;

		(async () => {
			const data = await submitFn();
			if (cancelled) return;

			if (!data) {
				setStatus("error");
				setErrorMsg("Failed to initiate PayNow deposit. Please try again.");
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
					observer.disconnect();
					if (!cancelled) {
						setStatus("error");
						setErrorMsg("PayNow button did not load in time. Please try again.");
					}
				}, BUTTON_WAIT_TIMEOUT_MS);

				const observer = new MutationObserver(() => {
					const btn = container.querySelector<HTMLElement>(
						"button, a, input[type='button'], input[type='submit']"
					);
					if (btn) {
						clearTimeout(timeout);
						observer.disconnect();
						if (!cancelled) setStatus("ready");
						// Auto-click disabled for debugging
						// btn.click();
					}
				});

				observer.observe(container, { childList: true, subtree: true });
			};

			script.onerror = () => {
				if (!cancelled) {
					setStatus("error");
					setErrorMsg("Failed to load PayNow script. Please try again.");
				}
			};

			container.appendChild(script);
		})();

		return () => { cancelled = true; };
	}, [submitFn]);

	return (
		<Dialog open onOpenChange={(open) => !open && onClose?.()}>
			<DialogContent className="sm:max-w-[530px] p-0 gap-0">
				<DialogHeader className="p-6 pb-4">
					<DialogTitle className="text-base font-semibold text-typo-primary text-left">
						PayNow
					</DialogTitle>
				</DialogHeader>
				<div className="px-6 pb-6 w-full">
					{status === "loading" && (
						<div className="flex items-center justify-center gap-2 py-8 text-typo-secondary">
							<Loader2 className="animate-spin size-5" />
							<span className="text-sm">Processing...</span>
						</div>
					)}
					{status === "error" && (
						<div className="text-sm text-status-error py-4">{errorMsg}</div>
					)}
					<div ref={containerRef} className={status === "loading" ? "hidden" : "w-full"} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
