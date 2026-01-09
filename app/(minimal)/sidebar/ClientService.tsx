// components/sidebar/ClientServices.tsx
import React, { useEffect, useState } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { Clock, Phone, Mail, MapPin, Copy, CircleArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { handleCopy, handleCall, handleEmail, handleOpenMap } from "@/lib/utils";
import { getClientServiceContact } from "@/lib/services/profileService";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientServiceData {
	operatingHours: string;
	callCentreNumber: string;
	callCentreEmailAddress: string;
	companyAddress: string;
}

const ClientServices = () => {
	const [businessInfo, setBusinessInfo] = useState<ClientServiceData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const res = await getClientServiceContact();
				if (res.success && res.data) {
					setBusinessInfo(res.data);
				}
			} catch (error) {
				console.error("Failed to fetch client service contact:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	if (isLoading || !businessInfo) {
		return (
			<div className="flex flex-col h-full overflow-hidden -mx-4 md:-mx-6">
				<div className="flex-shrink-0 pad-x">
					<CustomSheetTitle title="Client Services" backTo={"contact"} />
				</div>
				<div className="flex-1 pad-x pt-6">
					<div className="space-y-6">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="space-y-2">
								<Skeleton className="h-4 w-1/4" />
								<Skeleton className="h-6 w-full" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}



	return (
		<div className="flex flex-col h-full overflow-hidden -mx-4 md:-mx-6">
			<div className="flex-shrink-0 pad-x">
				<CustomSheetTitle title="Client Services" backTo={"contact"} />
			</div>

			<div className="flex-1 overflow-y-auto pad-x pr-2 md:pr-3">
				{/* Business Hours */}
				<div className="mt-6 p-4 rounded-lg bg-background-section">
					<div className="flex gap-2 items-center mb-3">
						<Clock size={16} className="text-icon-light" />
						<p className="text-sm font-semibold text-typo-primary">Business Hours</p>
					</div>
					<Separator className="my-3" />

					<div className="text-xs text-typo-secondary font-medium mb-3">
						Available: <span className="font-normal">{businessInfo.operatingHours.replace("Available", "")}</span>
					</div>
					{/* <div className="text-xs text-typo-secondary whitespace-pre-line">
					</div> */}
				</div>

				{/* Contact Information */}
				<div className="mt-4 space-y-4">
					{/* Phone */}
					<div className="flex items-center justify-between px-1.5 py-2.5">
						<div className="flex items-center gap-2 min-w-0 flex-1">
							<Phone size={16} className="text-icon-light flex-shrink-0" />
							<span className="text-sm text-typo-primary truncate">{businessInfo.callCentreNumber}</span>
						</div>
						<div className="flex gap-5 flex-shrink-0 ml-2">
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 hover:bg-transparent"
								onClick={() => handleCopy(businessInfo.callCentreNumber)}
							>
								<Copy size={16} className="text-enhanced-blue" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 hover:bg-transparent"
								onClick={() => handleCall(businessInfo.callCentreNumber)}
							>
								<CircleArrowRight size={16} className="text-enhanced-blue" />
							</Button>
						</div>
					</div>

					{/* Email */}
					<div className="flex items-center justify-between px-1.5 py-2.5">
						<div className="flex items-center gap-2 min-w-0 flex-1">
							<Mail size={16} className="text-icon-light flex-shrink-0" />
							<span className="text-sm text-typo-primary truncate">{businessInfo.callCentreEmailAddress}</span>
						</div>
						<div className="flex gap-5 flex-shrink-0 ml-2">
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 hover:bg-transparent"
								onClick={() => handleCopy(businessInfo.callCentreEmailAddress)}
							>
								<Copy size={16} className="text-enhanced-blue" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 hover:bg-transparent"
								onClick={() => handleEmail(businessInfo.callCentreEmailAddress)}
							>
								<CircleArrowRight size={16} className="text-enhanced-blue" />
							</Button>
						</div>
					</div>

					{/* Address */}
					<div className="flex items-center justify-between px-1.5 py-2.5">
						<div className="flex items-center gap-2 min-w-0 flex-1">
							<MapPin size={16} className="text-icon-light flex-shrink-0 mt-0.5" />
							<span className="text-sm text-typo-primary w-[90%]">{businessInfo.companyAddress}</span>
						</div>
						<div className="flex gap-5 flex-shrink-0 ml-2">
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 hover:bg-transparent"
								onClick={() => handleCopy(businessInfo.companyAddress)}
							>
								<Copy size={16} className="text-enhanced-blue" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 hover:bg-transparent"
								onClick={() => handleOpenMap(businessInfo.companyAddress)}
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

export default ClientServices;
