"use client";
import Alert from "@/components/Alert";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCancel: () => void;
	onAction: () => void;
};

const openDeclarationForm = () => {
	window.open("https://itrade.cgsi.com.sg/app/download/AccreditedInvestor_Declare.pdf", "_blank");
};

export function AlternativesAccessAlert({ open, onOpenChange, onCancel, onAction }: Props) {
	return (
		<Alert
			open={open}
			onOpenChange={onOpenChange}
			title="Access to Alternative Investments"
			description={
				<span className="text-sm md:text-base">
					Alternative Investments are available only to Accredited Investors. Please download
					and fill the{" "}
					<span
						className="text-cgs-blue font-medium underline cursor-pointer underline-offset-2"
						onClick={openDeclarationForm}
					>
						Declaration Form
					</span>
					, then send it to us via &quot;Contact Us&quot; to proceed.
				</span>
			}
			cancelText="Cancel"
			actionText="Contact Us"
			onCancel={onCancel}
			onAction={onAction}
		/>
	);
}
