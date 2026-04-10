import React from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { CGSI } from "@/constants/routes";

const PasswordSecurity = () => {
	return (
		<div>
			<CustomSheetTitle title="Password & Security" backTo={"profile"} />

			<div className="mt-6">
				<Link
					href={CGSI.CHANGE_PASSWORD}
					target="_blank"
					rel="noopener noreferrer"
					className="p-4 border border-stroke-secondary flex justify-between rounded hover:border-background-selected hover:shadow block"
				>
					<p className="text-sm text-typo-secondary">Change Password</p>
					<ChevronRight className="text-cgs-blue" size={20} />
				</Link>
			</div>
		</div>
	);
};

export default PasswordSecurity;
