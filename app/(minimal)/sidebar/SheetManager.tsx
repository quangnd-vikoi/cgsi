"use client";
import { useEffect, useRef, useState } from "react";
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
import TradingDeclartions from "./TradingDeclartions";
import TradingAccounts from "./TradingAccounts";
import TradingAccountDetail from "./TradingAccountDetail";
import UserProfile from "./UserProfile";
import MySubscriptions from "./MySubscriptions";

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
	trading_declarations: {
		component: TradingDeclartions,
	},
	trading_accounts: {
		component: TradingAccounts,
	},
	trading_account_details: {
		component: TradingAccountDetail,
	},
	user_profile: {
		component: UserProfile,
	},
	my_subscriptions: {
		component: MySubscriptions
	}
};

const ANIMATION_DURATION = 200;

export const SheetManager = () => {
	const openSheet = useSheetStore((state) => state.openSheet);
	const closeSheet = useSheetStore((state) => state.closeSheet);

	const [isOpen, setIsOpen] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);
	const lastSheetRef = useRef<ValidSheetType | null>(null);

	useEffect(() => {
		if (openSheet) {
			lastSheetRef.current = openSheet;
			setShouldRender(true);
			requestAnimationFrame(() => {
				setIsOpen(true);
			});
		} else {
			setIsOpen(false);
			const timer = setTimeout(() => {
				setShouldRender(false);
			}, ANIMATION_DURATION);
			return () => clearTimeout(timer);
		}
	}, [openSheet]);

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			closeSheet();
		}
	};

	if (!shouldRender || !lastSheetRef.current) return null;

	const config = SHEET_CONFIGS[lastSheetRef.current];
	const SheetComponent = config.component;

	return (
		<Sheet open={isOpen} onOpenChange={handleOpenChange}>
			<SheetContent
				side="right"
				className={cn(
					"max-w-full w-[352px] lg:w-[480px] rounded-l-lg border border-stroke-secondary border-r-0",
					"focus:outline-none pad-x py-6",
					config.className ?? ""
				)}
			>
				<SheetComponent />
			</SheetContent>
		</Sheet>
	);
};
