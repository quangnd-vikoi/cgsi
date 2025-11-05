import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PaynowIcon from "@/public/icons/discover/Paynow.svg";
import { Wallet } from "lucide-react";
const OneTimeForm = () => {
	return (
		<div className="space-y-6 pad-x py-6">
			<div className="space-y-4 text-sm font-normal text-typo-secondary">
				<p>
					Make a quick one-time donation today and uplift the lives of individuals who need
					assistance!
				</p>
				<p>
					Note: For PayNow, the bank account holder must be LIM YI BIN. Transfers from other account
					holders will be rejected.
				</p>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="donationAmount" className="text-sm font-semibold text-typo-primary">
					Donation Amount (SGD)
				</Label>
				<Input
					id="donationAmount"
					className="focus-visible:bg-background-focus focus-visible:border-enhanced-blue"
				></Input>
			</div>

			<div className="w-full">
				<Label className="text-sm font-semibold text-typo-primary ">Payment Method</Label>

				<RadioGroup defaultValue="now" className="space-y-2 mt-1.5">
					<Label className="flex justify-between w-full px-4 py-2 border border-stroke-secondary rounded-lg cursor-pointer">
						<div className="flex gap-3 items-center">
							<PaynowIcon />
							PayNow
						</div>
						<RadioGroupItem value="now" className="w-6 h-6" />
					</Label>

					<Label className="flex justify-between w-full px-4 py-2 border border-stroke-secondary rounded-lg cursor-pointer">
						<div className="flex gap-3 items-center">
							<Wallet size={24} className="text-icon-light" />
							Trust Account
						</div>
						<RadioGroupItem value="trust" className="w-6 h-6" />
					</Label>
				</RadioGroup>
			</div>
		</div>
	);
};

export default OneTimeForm;
