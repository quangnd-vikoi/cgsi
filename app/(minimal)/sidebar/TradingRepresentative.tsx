// components/sidebar/TradingRepresentative.tsx
import React from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { CircleArrowRight, CircleQuestionMark, Copy, Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

interface TradingRepresentativeData {
	id: string;
	name: string;
	managedAccounts: string;
	accountType: string;
	repNo: string;
	phone: string;
	email: string;
}

interface TradingListProps {
	representatives: TradingRepresentativeData[];
}

const TradingList = ({ representatives }: TradingListProps) => {
	const handleCopy = (text: string, type: "phone" | "email") => {
		navigator.clipboard.writeText(text);
		toast.success(`${type === "phone" ? "Phone number" : "Email"} copied to clipboard`);
	};

	const handleCall = (phone: string) => {
		window.location.href = `tel:${phone}`;
	};

	const handleEmail = (email: string) => {
		window.location.href = `mailto:${email}`;
	};

	return (
		<div className="space-y-4">
			{representatives.map((rep) => (
				<div
					key={rep.id}
					className="p-4 rounded border border-stroke-secondary bg-background-primary"
				>
					{/* Header */}
					<div className="flex justify-between items-start mb-4">
						<h3 className="text-base font-semibold text-typo-primary">{rep.name}</h3>
					</div>

					{/* Account Info */}
					<div className="space-y-2 mb-4">
						<div className="flex justify-between text-xs">
							<span className="text-typo-secondary">Managed Account(s)</span>
							<span className="text-typo-primary font-medium">
								({rep.accountType}) {rep.managedAccounts}
							</span>
						</div>
						<div className="flex justify-between text-xs">
							<span className="text-typo-secondary">Rep. No.</span>
							<span className="text-typo-primary font-medium">{rep.repNo}</span>
						</div>
					</div>

					<Separator className="my-4" />
					{/* Contact Info */}
					<div className="space-y-4">
						{/* Phone */}
						<div className="flex items-center justify-between px-1.5 py-2.5">
							<div className="flex items-center gap-2 min-w-0 flex-1">
								<Phone size={16} className="text-icon-light flex-shrink-0" />
								<span className="text-sm text-typo-primary truncate">{rep.phone}</span>
							</div>
							<div className="flex gap-5 flex-shrink-0 ml-2">
								<Button
									variant="ghost"
									size="icon"
									className="h-5 w-5 hover:bg-transparent"
									onClick={() => handleCopy(rep.phone, "phone")}
								>
									<Copy size={16} className="text-cgs-blue" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-5 w-5 hover:bg-transparent"
									onClick={() => handleCall(rep.phone)}
								>
									<CircleArrowRight size={16} className="text-cgs-blue" />
								</Button>
							</div>
						</div>

						{/* Email */}
						<div className="flex items-center justify-between px-1.5 py-2.5">
							<div className="flex items-center gap-2 min-w-0 flex-1">
								<Mail size={16} className="text-icon-light flex-shrink-0" />
								<span className="text-sm text-typo-primary truncate">{rep.email}</span>
							</div>
							<div className="flex gap-5 flex-shrink-0 ml-2">
								<Button
									variant="ghost"
									size="icon"
									className="h-5 w-5 hover:bg-transparent"
									onClick={() => handleCopy(rep.email, "email")}
								>
									<Copy size={16} className="text-cgs-blue" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-5 w-5 hover:bg-transparent"
									onClick={() => handleEmail(rep.email)}
								>
									<CircleArrowRight size={16} className="text-cgs-blue" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

const TradingRepresentative = () => {
	// Mock data - thay bằng data thật từ API
	const representatives = [
		{
			id: "1",
			name: "Lim Yi Bin",
			managedAccounts: "6412345",
			accountType: "Cash",
			repNo: "TTK100025745",
			phone: "+65 6538 9889",
			email: "yibin.lim@cgsi.com",
		},
		{
			id: "2",
			name: "Dlynn Tan",
			managedAccounts: "6412346",
			accountType: "Margin",
			repNo: "TTK100025746",
			phone: "+65 6538 9890",
			email: "dlynn.tan@cgsi.com",
		},
		{
			id: "3",
			name: "Rayhan Abhirama",
			managedAccounts: "6412347",
			accountType: "iCash",
			repNo: "TTK100025747",
			phone: "+65 6538 9891",
			email: "rayhan.abhiramasjah@cgsi.com",
		},
	];

	return (
		<div className="flex flex-col h-full ">
			<div className="flex-shrink-0">
				<CustomSheetTitle title="Trading Representative(s)" backTo={"contact"} />
			</div>

			<div className="flex-1 overflow-y-auto sidebar-scroll scrollbar-offset-laptop scrollbar-offset-right">
				<div className="mt-6 p-4 rounded bg-background-section">
					<div className="flex gap-2 items-center">
						<CircleQuestionMark size={16} className="text-icon-light" />
						<p className="text-sm font-semibold text-typo-primary">Information</p>
					</div>
					<Separator className="my-3" />

					<div className="text-typo-secondary text-xs">
						Please reach out to your TR for support requests. They will respond to your enquiry as
						soon as they can.
					</div>
				</div>

				<div className="mt-6 pb-6">
					<TradingList representatives={representatives} />
				</div>
			</div>
		</div>
	);
};

export default TradingRepresentative;
