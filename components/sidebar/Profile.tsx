import { SheetHeader, SheetTitle, SheetClose } from "../ui/sheet";
import { X } from "lucide-react";
const Profile = () => {
	return (
		<div>
			<SheetHeader className="p-0 text-[16px] lg:text-lg ">
				<div className="flex justify-between ">
					<SheetTitle className="text-typo-primary">Profile Centre</SheetTitle>
					<SheetClose className="text-typo-secondary">
						<X />
					</SheetClose>
				</div>
			</SheetHeader>
			<div className="mt-4">
				{/* Your Profile items */}
				<p>Profile content here</p>
			</div>
		</div>
	);
};

export default Profile;
