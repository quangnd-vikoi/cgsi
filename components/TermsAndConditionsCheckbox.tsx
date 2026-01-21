import { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import CustomCircleAlert from "@/components/CircleAlertIcon";

interface TermsAndConditionsCheckboxProps {
	id?: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	showError?: boolean;
	labelText?: string;
	termsUrl?: string;
	additionalContent?: ReactNode;
	errorMessage?: string;
	className?: string;
	showLink?: boolean;
}

const TermsAndConditionsCheckbox = ({
	id = "terms-checkbox",
	checked,
	onCheckedChange,
	showError = false,
	labelText = "I acknowledge that I have read and agreed to the",
	termsUrl = "#",
	additionalContent,
	errorMessage = "Please acknowledge the Terms & Conditions to proceed",
	className = "",
	showLink = true,
}: TermsAndConditionsCheckboxProps) => {
	return (
		<div className={className}>
			<div className="flex items-start gap-2">
				<Checkbox
					id={id}
					checked={checked}
					onCheckedChange={onCheckedChange}
					className="mt-0.5"
					error={showError}
				/>
				<Label
					htmlFor={id}
					className="text-xs md:text-sm text-typo-secondary cursor-pointer leading-5 font-normal select-text"
				>
					<span>
						{labelText}
						{showLink && (
							<>
								{" "}
								<Link
									href={termsUrl}
									target="_blank"
									className="inline text-cgs-blue font-semibold !underline !underline-offset-2"
								>
									Terms & Conditions
								</Link>
							</>
						)}
						{additionalContent}
					</span>
				</Label>
			</div>
			{showError && (
				<p className="text-status-error text-xs mt-1 flex items-center gap-1">
					<CustomCircleAlert />
					{errorMessage}
				</p>
			)}
		</div>
	);
};

export default TermsAndConditionsCheckbox;
