// components/sidebar/TradingRepresentative.tsx
import React, { useEffect, useState } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { CircleArrowRight, CircleQuestionMark, Copy, Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { handleCopy, handleCall, handleEmail } from "@/lib/utils";
import { getTradingRepInfo } from "@/lib/services/profileService";
import { Skeleton } from "@/components/ui/skeleton";
import type { ITrInfo } from "@/types";

interface TradingListProps {
	representatives: ITrInfo[];
}

const TradingList = ({ representatives }: TradingListProps) => {
	return (
		<div className="space-y-4">
			{representatives.map((rep, index) => (
				<div
					key={index}
					className="p-4 rounded border border-stroke-secondary bg-background-primary"
				>
					{/* Header */}
					<div className="flex justify-between items-start mb-4">
						<h3 className="text-base font-semibold text-typo-primary">{rep.trName}</h3>
					</div>

					{/* Rep Info */}
					<div className="space-y-2 mb-4">
						<div className="flex justify-between text-rsp-xs">
							<span className="text-typo-secondary">Rep. No.</span>
							<span className="text-typo-primary font-medium">{rep.trCode}</span>
						</div>
					</div>

					<Separator className="my-4" />
					{/* Contact Info */}
					<div className="space-y-4">
						{/* Phone */}
						{rep.trContact && (
							<div className="flex items-center justify-between px-1.5 py-2.5">
								<div className="flex items-center gap-2 min-w-0 flex-1">
									<Phone size={16} className="text-icon-light flex-shrink-0" />
									<span className="text-rsp-sm text-typo-primary truncate">
										{rep.trContact}
									</span>
								</div>
								<div className="flex gap-5 flex-shrink-0 ml-2">
									<Button
										variant="ghost"
										size="icon"
										className="h-5 w-5 hover:bg-transparent"
										onClick={() => handleCopy(rep.trContact)}
									>
										<Copy size={16} className="text-cgs-blue" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-5 w-5 hover:bg-transparent"
										onClick={() => handleCall(rep.trContact)}
									>
										<CircleArrowRight size={16} className="text-cgs-blue" />
									</Button>
								</div>
							</div>
						)}

						{/* Email */}
						{rep.trEmail && (
							<div className="flex items-center justify-between px-1.5 py-2.5">
								<div className="flex items-center gap-2 min-w-0 flex-1">
									<Mail size={16} className="text-icon-light flex-shrink-0" />
									<span className="text-rsp-sm text-typo-primary truncate">
										{rep.trEmail}
									</span>
								</div>
								<div className="flex gap-5 flex-shrink-0 ml-2">
									<Button
										variant="ghost"
										size="icon"
										className="h-5 w-5 hover:bg-transparent"
										onClick={() => handleCopy(rep.trEmail)}
									>
										<Copy size={16} className="text-cgs-blue" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-5 w-5 hover:bg-transparent"
										onClick={() => handleEmail(rep.trEmail)}
									>
										<CircleArrowRight size={16} className="text-cgs-blue" />
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

const TradingRepresentative = () => {
	const [representatives, setRepresentatives] = useState<ITrInfo[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const hasFetched = React.useRef(false);

	useEffect(() => {
		if (hasFetched.current) return;
		hasFetched.current = true;

		const fetchData = async () => {
			try {
				setIsLoading(true);
				const res = await getTradingRepInfo();
				if (res.success && res.data) {
					setRepresentatives(res.data);
				}
			} catch (error) {
				console.error("Failed to fetch trading representative info:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	if (isLoading) {
		return (
			<div className="flex flex-col h-full">
				<div className="flex-shrink-0">
					<CustomSheetTitle title="Trading Representative(s)" backTo={"contact"} />
				</div>
				<div className="flex-1 pt-6 px-4">
					<div className="space-y-4">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="p-4 rounded border border-stroke-secondary">
								<Skeleton className="h-5 w-1/3 mb-4" />
								<Skeleton className="h-4 w-full mb-2" />
								<Skeleton className="h-4 w-2/3" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full ">
			<div className="flex-shrink-0">
				<CustomSheetTitle title="Trading Representative(s)" backTo={"contact"} />
			</div>

			<div className="flex-1 overflow-y-auto sidebar-scroll scrollbar-offset-laptop scrollbar-offset-right">
				<div className="mt-6 p-4 rounded bg-background-section">
					<div className="flex gap-2 items-center">
						<CircleQuestionMark size={16} className="text-icon-light" />
						<p className="text-rsp-sm font-semibold text-typo-primary">Information</p>
					</div>
					<Separator className="my-3" />

					<div className="text-typo-secondary text-rsp-xs">
						Please reach out to your TR for support requests. They will respond to your enquiry as
						soon as they can.
					</div>
				</div>

				<div className="mt-6 pb-6">
					{representatives.length > 0 ? (
						<TradingList representatives={representatives} />
					) : (
						<p className="text-sm text-typo-secondary text-center py-4">
							No trading representative information available.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default TradingRepresentative;
