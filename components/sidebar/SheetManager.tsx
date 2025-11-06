// components/SheetManager.tsx
"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSheetStore } from "@/stores/sheetStore";
import { cn } from "@/lib/utils";
import Notification from "@/components/sidebar/Notification";
import Profile from "@/components/sidebar/Profile";
import Announcements from "@/components/sidebar/Announcements";
import Contact from "./Contact";
import TradingRepresentative from "./TradingRepresentative";
import ClientServices from "./ClientService";
import CentralDealingDesk from "./CentralDealingDesk";
import PasswordSecurity from "./PasswordSecurity";
import DetailNotification from "./DetailNotification";

const SHEET_CONFIGS = {
	notification: {
		component: Notification,
		className: "pad-x py-6",
	},
	profile: {
		component: Profile,
		className: "!p-0 !px-0 border-none",
	},
	announcement: {
		component: Announcements,
		className: "pad-x py-6",
	},
	contact: {
		component: Contact,
		className: "pad-x py-6",
	},
	trading_representative: {
		component: TradingRepresentative,
		className: "pad-x pt-6",
	},
	client_services: {
		component: ClientServices,
		className: "pad-x py-6",
	},
	central_dealing_desk: {
		component: CentralDealingDesk,
		className: "pad-x py-6",
	},
	password_and_security: {
		component: PasswordSecurity,
		className: "pad-x py-6",
	},
	detail_notification: {
		component: DetailNotification,
		className: "pad-x py-6",
	},
} as const;

type SheetConfigKey = keyof typeof SHEET_CONFIGS;

// Default config cho các sheet chưa được định nghĩa
const DEFAULT_SHEET_CONFIG = {
	component: Contact, // hoặc một component placeholder khác
	className: "pad-x py-6",
};

export const SheetManager = () => {
	const openSheet = useSheetStore((state) => state.openSheet);
	const closeSheet = useSheetStore((state) => state.closeSheet);

	if (!openSheet) return null;

	// Lấy config từ SHEET_CONFIGS, nếu không có thì dùng default
	const config =
		openSheet in SHEET_CONFIGS ? SHEET_CONFIGS[openSheet as SheetConfigKey] : DEFAULT_SHEET_CONFIG;

	const SheetComponent = config.component;

	return (
		<Sheet open={true} onOpenChange={closeSheet}>
			<SheetContent
				side="right"
				className={cn(
					"w-[352px] lg:w-[432px] rounded-l-lg border border-stroke-secondary border-r-0",
					"top-[56px] md:top-[72px] h-[calc(100vh-56px)] md:h-[calc(100vh-72px)]",
					"focus:outline-none",
					config.className
				)}
			>
				<SheetComponent />
			</SheetContent>
		</Sheet>
	);
};
