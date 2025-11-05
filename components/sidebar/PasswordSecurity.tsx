import React from "react";
import CustomSheetTitle from "./CustomSheetTitle";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { CGSI } from "@/constants/routes";

const PasswordSecurity = () => {
	return (
		<div>
			<CustomSheetTitle title="Password & Security" backTo={"profile"} />

			<div className="mt-6">
				<div className="p-4 border border-stroke-secondary flex justify-between rounded-lg">
					<p className="text-sm text-typo-secondary">Change Password</p>
					<Link href={CGSI.CHANGE_PASSWORD} target="_blank">
						<ChevronRight className="text-enhanced-blue" size={20} />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PasswordSecurity;
