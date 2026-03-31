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
import { usePermissions } from "@/hooks/usePermission";
import { FEATURE_ACCESS } from "@/constants/accessControl";

const UPDATE_FEATURES = {
	sidebar_update_mobile: FEATURE_ACCESS.sidebar_update_mobile,
	sidebar_update_email: FEATURE_ACCESS.sidebar_update_email,
	sidebar_update_signature: FEATURE_ACCESS.sidebar_update_signature,
} as const;

const UserProfile = () => {
	const router = useRouter();
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);
	const profile = useUserStore((state) => state.profile);
	const { permissions: updatePerms } = usePermissions(UPDATE_FEATURES);

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
					<Label htmlFor="username" className="text-rsp-sm font-semibold text-typo-primary">Username</Label>
					<div className="relative">
						<Input
							id="username"
							type="text"
							value={displayUsername}
							disabled
							className="bg-theme-neutral-095 text-rsp-sm font-normal text-typo-tertiary pr-20"
						/>
					</div>
				</div>

				{/* Mobile Number */}
				<div className="space-y-2">
					<Label htmlFor="mobile" className="text-rsp-sm font-semibold text-typo-primary">Mobile Number</Label>
					<div className="relative">
						<div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
							<CircleFlag countryCode={countryCode.toLowerCase()} className="w-5 h-5" />
							<span className="text-rsp-sm ml-2 font-normal text-typo-primary">{dialCode}</span>
							</div>
						<Input
							id="mobile"
							type="text"
							value={phoneNumber}
							disabled
							className="disabled:opacity-100 pl-20 pr-20 text-rsp-sm font-normal text-typo-primary"
						/>
						{updatePerms.sidebar_update_mobile && (
							<Button
								onClick={() => handleUpdateClick("mobile")}
								variant="link"
								className="text-cgs-blue underline underline-offset-2 text-rsp-sm font-medium absolute right-0 top-1/2 -translate-y-1/2 h-auto py-0 px-3"
							>
								Update
							</Button>
						)}
					</div>
				</div>

				{/* Email Address */}
				<div className="space-y-2">
					<Label htmlFor="email" className="text-rsp-sm font-semibold text-typo-primary">Email Address</Label>
					<div className="relative">
						<Input
							className="disabled:opacity-100 pr-20 text-rsp-sm font-normal text-typo-primary"
							id="email"
							type="email"
							value={displayEmail}
							disabled
						/>
						{updatePerms.sidebar_update_email && (
							<Button
								onClick={() => handleUpdateClick("email")}
								variant="link"
								className="text-cgs-blue underline underline-offset-2 text-rsp-sm font-medium absolute right-0 top-1/2 -translate-y-1/2 h-auto py-0 px-3"
							>
								Update
							</Button>
						)}
					</div>
				</div>

				{/* Signature Section */}
				{updatePerms.sidebar_update_signature && (
					<div className="space-y-3">
						<Label className="text-rsp-sm font-semibold text-typo-primary">Signature</Label>
						<p className="text-sm font-normal text-typo-secondary leading-relaxed pr-1">
							Updating your signature will replace the existing one, or create a new record if
							none exists. The signature will be stored securely but won&apos;t be visible after
							upload.
						</p>

						<Button
							onClick={() => handleUpdateClick("signature")}
							variant="outline"
							className="w-full border-dashed border-cgs-blue bg-background-section justify-between py-3 !px-4 text-rsp-sm font-medium text-cgs-blue h-fit hover:bg-cgs-blue/10 hover:text-cgs-blue"
						>
							Update Signature
							<FileUp className="w-4 h-4" />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserProfile;
