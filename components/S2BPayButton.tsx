"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface S2BPayButtonProps {
	s2bPayUrl: string;
	corpId: string;
	encStr: string;
	buttonText?: string;
	buttonHeight?: number;
	buttonWidth?: number;
}

export function S2BPayButton({
	s2bPayUrl,
	corpId,
	encStr,
	buttonText = "Agree",
	buttonHeight = 30,
	buttonWidth = 80,
}: S2BPayButtonProps) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		if (!containerRef.current) return;

		setIsLoading(true);
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
		script.onload = () => setIsLoading(false);
		script.onerror = () => setIsLoading(false);
		containerRef.current.appendChild(script);
	}, [s2bPayUrl, corpId, encStr, buttonText, buttonHeight, buttonWidth]);

	return (
		<div>
			{isLoading && <Loader2 className="animate-spin text-cgs-blue" />}
			<div ref={containerRef} />
		</div>
	);
}
