"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSheetStore } from "@/stores/sheetStore";
import { cn } from "@/lib/utils";
import Notification from "./Notification";
import Profile from "./Profile";
import Announcements from "./Announcements";
import Contact from "./Contact";
import TradingRepresentative from "./TradingRepresentative";
import ClientServices from "./ClientService";
import CentralDealingDesk from "./CentralDealingDesk";
import PasswordSecurity from "./PasswordSecurity";
import DetailNotification from "./DetailNotification";
import { SheetType } from "@/types";
import Acknowledgements from "./Acknowledgements";

type ValidSheetType = Exclude<SheetType, null>;

type SheetConfig = {
	component: React.ComponentType;
	className?: string;
};

const SHEET_CONFIGS: Record<ValidSheetType, SheetConfig> = {
	notification: {
		component: Notification,
		className: "",
	},
	profile: {
		component: Profile,
		className: "!p-0 !px-0 border-none",
	},
	announcement: {
		component: Announcements,
	},
	contact: {
		component: Contact,
	},
	trading_representative: {
		component: TradingRepresentative,
		className: "pt-6",
	},
	client_services: {
		component: ClientServices,
	},
	central_dealing_desk: {
		component: CentralDealingDesk,
	},
	password_and_security: {
		component: PasswordSecurity,
	},
	detail_notification: {
		component: DetailNotification,
	},
	acknowledgements: {
		component: Acknowledgements,
		className: "pb-0 pt-6",
	},
};

export const SheetManager = () => {
	const openSheet = useSheetStore((state) => state.openSheet);
	const closeSheet = useSheetStore((state) => state.closeSheet);

	if (!openSheet) return null;

	const config = SHEET_CONFIGS[openSheet];
	const SheetComponent = config.component;

	return (
		<Sheet open onOpenChange={closeSheet}>
			<SheetContent
				side="right"
				className={cn(
					"max-w-full w-[352px] lg:w-[432px] rounded-l-lg border border-stroke-secondary border-r-0",
					"top-[56px] md:top-[72px] h-[calc(100vh-56px)] md:h-[calc(100vh-72px)]",
					"focus:outline-none pad-x py-6",
					config.className ?? ""
				)}
			>
				<SheetComponent />
			</SheetContent>
		</Sheet>
	);
};
