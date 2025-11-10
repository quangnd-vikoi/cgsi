// components/sidebar/CentralDealingDesk.tsx
import React from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { Clock, Phone, MapPin, Copy, CircleArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";

const CentralDealingDesk = () => {
	const handleCopy = (text: string, type: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`${type} copied to clipboard`);
	};

	const handleCall = (phone: string) => {
		window.location.href = `tel:${phone}`;
	};

	const handleOpenMap = (address: string) => {
		const encodedAddress = encodeURIComponent(address);
		window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
	};

	const businessInfo = {
		hours: "08:30 - 17:30 SGT, 21:30 - 04:00 SGT (Mon-Fri)",
		phone: "+65 6232 5888",
		address: "10 Marina Boulevard, #09-01 Marina Bay Financial Centre Tower 2, Singapore 018983",
	};

	return (
		<div className="flex flex-col h-full overflow-hidden -mx-4 md:-mx-6">
			<div className="flex-shrink-0 pad-x">
				<CustomSheetTitle title="Central Dealing Desk" backTo={"contact"} />
			</div>

			<div className="flex-1 overflow-y-auto pad-x pr-2 md:pr-3">
				{/* Business Hours */}
				<div className="mt-6 p-4 rounded-lg bg-background-section">
					<div className="flex gap-2 items-center mb-3">
						<Clock size={16} className="text-icon-light" />
						<p className="text-sm font-semibold text-typo-primary">Business Hours</p>
					</div>
					<Separator className="my-3" />
					<div className="text-xs text-typo-secondary font-medium">
						Available:
						<span className="font-normal ml-1">{businessInfo.hours}</span>
					</div>
				</div>

				{/* Contact Information */}
				<div className="mt-4 space-y-4">
					{/* Phone */}
					<div className="flex items-center justify-between px-1.5 py-2.5">
						<div className="flex items-center gap-2 min-w-0 flex-1">
							<Phone size={16} className="text-icon-light flex-shrink-0" />
							<span className="text-sm text-typo-primary truncate">{businessInfo.phone}</span>
						</div>
						<div className="flex gap-5 flex-shrink-0 ml-2">
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 hover:bg-transparent"
								onClick={() => handleCopy(businessInfo.phone, "Phone number")}
							>
								<Copy size={16} className="text-enhanced-blue" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 hover:bg-transparent"
								onClick={() => handleCall(businessInfo.phone)}
							>
								<CircleArrowRight size={16} className="text-enhanced-blue" />
							</Button>
						</div>
					</div>

					{/* Address */}
					<div className="flex items-center justify-between px-1.5 py-2.5">
						<div className="flex items-center gap-2 min-w-0 flex-1">
							<MapPin size={16} className="text-icon-light flex-shrink-0 mt-0.5" />
							<span className="text-sm text-typo-primary">{businessInfo.address}</span>
						</div>
						<div className="flex gap-5 flex-shrink-0 ml-2">
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 hover:bg-transparent"
								onClick={() => handleCopy(businessInfo.address, "Address")}
							>
								<Copy size={16} className="text-enhanced-blue" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 hover:bg-transparent"
								onClick={() => handleOpenMap(businessInfo.address)}
							>
								<CircleArrowRight size={16} className="text-enhanced-blue" />
							</Button>
						</div>
					</div>
				</div>

				<div className="pb-6" />
			</div>
		</div>
	);
};

export default CentralDealingDesk;
