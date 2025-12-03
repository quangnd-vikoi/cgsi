import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSheetStore } from "@/stores/sheetStore";

const UserProfile = () => {
	const router = useRouter();
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);
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
					<Input
						id="username"
						type="text"
						value={"rayhanabhirama28"}
						readOnly
						className="bg-theme-neutral-095"
					/>
				</div>

				{/* Mobile Number */}
				<div className="space-y-2">
					<Label htmlFor="mobile">Mobile Number</Label>
					<div className="relative">
						<Input
							id="mobile"
							type="text"
							value={"+65 81234567"}
							readOnly
							className="bg-theme-neutral-095 pr-20"
						/>
						<Button
							onClick={() => handleUpdateClick("mobile")}
							variant="link"
							className="text-enhanced-blue hover:no-underline text-sm font-medium absolute right-0 top-1/2 -translate-y-1/2 h-auto py-0 px-3"
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
							className="bg-theme-neutral-095 pr-20"
							id="email"
							type="email"
							value={"rayhan.abhir@gmail.com"}
							readOnly
						/>

						<Link href={"/update-email"} className="hover:no-underline">
							<Button
								onClick={() => handleUpdateClick("email")}
								variant="link"
								className="text-enhanced-blue hover:no-underline text-sm font-medium absolute right-0 top-1/2 -translate-y-1/2 h-auto py-0 px-3"
							>
								Update
							</Button>
						</Link>
					</div>
				</div>

				{/* Signature Section */}
				<div className="space-y-3">
					<Label>Signature</Label>
					<p className="text-xs text-muted-foreground leading-relaxed pr-1">
						Updating your signature will replace the existing one, or create a new record if none
						exists. The signature will be stored securely but won&apos;t be visible after upload.
					</p>

					<div className="w-full flex justify-end">
						<Button
							onClick={() => handleUpdateClick("signature")}
							variant="outline"
							className="border-enhanced-blue text-enhanced-blue hover:bg-white hover:text-enhanced-blue/70 hover:border-enhanced-blue/70 w-fit font-normal px-3 py-1.5"
						>
							Update Signature
							<ChevronRight className="w-4 h-4 -ml-1" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
