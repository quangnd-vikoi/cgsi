import { ChevronDown, FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { useRouter } from "next/navigation";
import { useSheetStore } from "@/stores/sheetStore";
import { useUserStore } from "@/stores/userStore";
import { CircleFlag } from "react-circle-flags";
import { parsePhoneNumber } from "@/lib/utils/phoneHelper";

const UserProfile = () => {
	const router = useRouter();
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);
	const profile = useUserStore((state) => state.profile);

	// Fallback values when API returns null/undefined
	const displayUsername = profile?.userId || profile?.name || "guestuser";
	const displayEmail = profile?.email || "user@example.com";

	// Parse mobile number to extract country code and phone number
	const parsedPhone = parsePhoneNumber(profile?.mobileNo || "+65-12345678");
	const { countryCode, dialCode, phoneNumber } = parsedPhone;

	const handleUpdateClick = (type: "mobile" | "email" | "signature") => {
		setOpenSheet(null);
		if (type === "mobile") {
			router.push("/update-mobile");
		} else if (type === "email") {
			router.push("/update-email");
		} else if (type === "signature") {
			router.push("/update-signature");
		}
	};

	return (
		<div>
			<CustomSheetTitle backTo={"profile"} title="User Profile" />

			<div className="mt-6 space-y-6">
				{/* Username */}
				<div className="space-y-2">
					<Label htmlFor="username">Username</Label>
					<div className="relative">
						<Input
							id="username"
							type="text"
							value={displayUsername}
							readOnly
							className="bg-theme-neutral-095 text-typo-tertiary pr-20"
						/>
						<Button
							variant="link"
							className="text-cgs-blue underline underline-offset-2 text-sm font-medium absolute right-0 top-1/2 -translate-y-1/2 h-auto py-0 px-3"
						>
							Update
						</Button>
					</div>
				</div>

				{/* Mobile Number */}
				<div className="space-y-2">
					<Label htmlFor="mobile">Mobile Number</Label>
					<div className="relative">
						<div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
							<CircleFlag countryCode={countryCode.toLowerCase()} className="w-5 h-5" />
							<span className="text-sm ml-2 text-typo-tertiary">{dialCode}</span>
							<ChevronDown className="w-4 h-4 text-typo-tertiary" />
						</div>
						<Input
							id="mobile"
							type="text"
							value={phoneNumber}
							readOnly
							className="bg-theme-neutral-095 pl-24 pr-20 text-typo-tertiary"
						/>
						<Button
							onClick={() => handleUpdateClick("mobile")}
							variant="link"
							className="text-cgs-blue underline underline-offset-2 text-sm font-medium absolute right-0 top-1/2 -translate-y-1/2 h-auto py-0 px-3"
						>
							Update
						</Button>
					</div>
				</div>

				{/* Email Address */}
				<div className="space-y-2">
					<Label htmlFor="email">Email Address</Label>
					<div className="relative">
						<Input
							className="bg-theme-neutral-095 pr-20 text-typo-tertiary"
							id="email"
							type="email"
							value={displayEmail}
							readOnly
						/>
						<Button
							onClick={() => handleUpdateClick("email")}
							variant="link"
							className="text-cgs-blue underline underline-offset-2 text-sm font-medium absolute right-0 top-1/2 -translate-y-1/2 h-auto py-0 px-3"
						>
							Update
						</Button>
					</div>
				</div>

				{/* Signature Section */}
				<div className="space-y-3">
					<Label>Signature</Label>
					<p className="text-xs text-muted-foreground leading-relaxed pr-1">
						Updating your signature will replace the existing one, or create a new record if none
						exists. The signature will be stored securely but won&apos;t be visible after upload.
					</p>

					<Button
						onClick={() => handleUpdateClick("signature")}
						variant="outline"
						className="w-full border-dashed border-cgs-blue bg-background-section justify-between py-3 !px-4 text-cgs-blue h-fit"
					>
						Upload Document
						<FileUp className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
