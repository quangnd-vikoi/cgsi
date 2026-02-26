import Image from "@/components/Image";
import { SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import {
	BookOpen,
	Box,
	Boxes,
	Building2,
	ChevronRight,
	CircleQuestionMark,
	CircleUserRound,
	FileCheck,
	FileText,
	Headphones,
	HeartHandshake,
	Loader2,
	Settings,
	ShieldCheck,
	X,
} from "lucide-react";
import { JSX, useState } from "react";
import Link from "next/link";
import { SheetType } from "@/types";
import { useSheetStore } from "@/stores/sheetStore";
import { CGSI } from "@/constants/routes";
import Group from "./_components/Group"; // Import component Group
import { getBgImageClass } from "@/lib/utils";
import { redirectToCorporateAction, redirectToEStatement } from "@/lib/services/ssoService";
import { useUserStore } from "@/stores/userStore";
import { authService } from "@/lib/services/authService";

// Centralized icon stroke width - easy to change
const ICON_STROKE_WIDTH = 1.5;

const ProfileInfo = () => {
	const profile = useUserStore((state) => state.profile);

	// Fallback values when API returns null/undefined
	const displayName = profile?.name || profile?.userId || "Guest User";
	const displayEmail = profile?.email || "email@example.com";
	const displayMobile = profile?.mobileNo || "+65 XXXX XXXX";

	return (
		<div className="flex flex-col gap-1.5 text-white">
			<p className="text-base md:text-lg font-semibold">{displayName}</p>
			<p className="text-xs md:text-sm font-normal">{displayEmail}</p>
			<p className="text-xs md:text-sm font-normal">{displayMobile}</p>
		</div>
	);
};

interface IProfileMenuItem {
	icon: JSX.Element;
	name: string;
	href?: string;
	sheet?: SheetType;
	target?: "_blank" | "_self";
	onClick?: () => void | Promise<void>;
	isLoading?: boolean;
}

const MenuItem = ({ item }: { item: IProfileMenuItem }) => {
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);
	const [isProcessing, setIsProcessing] = useState(false);

	const handleClick = async () => {
		if (item.onClick) {
			setIsProcessing(true);
			try {
				await item.onClick();
			} finally {
				setIsProcessing(false);
			}
		} else if (item.sheet !== undefined) {
			setOpenSheet(item.sheet);
		}
	};

	const isLoading = isProcessing || item.isLoading;

	const content = (
		<>
			<div className="flex gap-4 items-center text-typo-secondary">
				<div className="w-5 h-5 flex items-center justify-center">
					{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : item.icon}
				</div>
				<div className="text-sm md:text-base font-normal">{item.name}</div>
			</div>
			<ChevronRight className="w-5 text-cgs-blue" strokeWidth={2} />
		</>
	);

	// Render Link for href items (without onClick)
	if (item.href && !item.onClick) {
		return (
			<Link href={item.href} target={item.target || "_self"} onClick={() => setOpenSheet(null)} className="flex justify-between hover:bg-status-selected rounded p-4 transition-colors">
				{content}
			</Link>
		);
	}

	// Render clickable div for onClick or sheet items
	if (item.onClick || item.sheet !== undefined) {
		return (
			<div
				className={`flex justify-between cursor-pointer hover:bg-status-selected rounded p-4 transition-colors ${isLoading ? "opacity-50 pointer-events-none cursor-wait" : ""}`}
				onClick={handleClick}
			>
				{content}
			</div>
		);
	}

	// Fallback for items without actions
	return <div className="flex justify-between hover:bg-status-selected rounded p-4 transition-colors">{content}</div>;
};

const Profile = () => {
	const handleLogout = () => {
		authService.logout();
	};

	const PROFILE_MENU_ITEM = {
		"Account Centre": [
			{
				icon: <CircleUserRound strokeWidth={ICON_STROKE_WIDTH} />,
				name: "User Profile",
				sheet: "user_profile" as SheetType,
			},
			{
				icon: <ShieldCheck strokeWidth={ICON_STROKE_WIDTH} />,
				name: "Password & Security",
				sheet: "password_and_security" as SheetType,
			},
			{
				icon: <HeartHandshake strokeWidth={ICON_STROKE_WIDTH} />,
				name: "Donations",
				href: "/donations",
			},
		],
		"Trading Centre": [
			{
				icon: <BookOpen strokeWidth={ICON_STROKE_WIDTH} />,
				name: "Trading Accounts",
				sheet: "trading_accounts" as SheetType,
			},
			{
				icon: <FileCheck strokeWidth={ICON_STROKE_WIDTH} />,
				name: "Trading Declarations",
				sheet: "trading_declarations" as SheetType,
			},
			{
				icon: <Building2 strokeWidth={ICON_STROKE_WIDTH} />,
				name: "Corporate Actions",
				onClick: redirectToCorporateAction,
			},
			{
				icon: <Box strokeWidth={ICON_STROKE_WIDTH} />,
				name: "Market Data & Add-Ons",
				href: "/market-data",
			},
			{
				icon: <Boxes strokeWidth={ICON_STROKE_WIDTH} />,
				name: "My Subscriptions",
				sheet: "my_subscriptions" as SheetType,
			},
		],
		Reports: [
			{
				icon: <FileText strokeWidth={ICON_STROKE_WIDTH} />,
				name: "eStatements",
				onClick: redirectToEStatement,
			},
			{
				icon: <FileCheck strokeWidth={ICON_STROKE_WIDTH} />,
				name: "Acknowledgements",
				sheet: "acknowledgements" as SheetType,
			},
		],
		"Help & Support": [
			{
				icon: <Headphones strokeWidth={ICON_STROKE_WIDTH} />,
				name: "Contact Us",
				sheet: "contact" as SheetType,
			},
			{
				icon: <CircleQuestionMark strokeWidth={ICON_STROKE_WIDTH} />,
				name: "Help Centre",
				href: CGSI.HELP_CENTRE,
				target: "_blank" as IProfileMenuItem["target"],
			},
			{
				icon: <Settings strokeWidth={ICON_STROKE_WIDTH} />,
				name: "Settings",
				href: "/settings",
			},
		],
	};

	return (
		<div className="h-full flex flex-col">
			<SheetHeader
				className="text-base md:text-xl font-semibold p-6 bg-cover rounded-tl-md flex-shrink-0"
				style={{ backgroundImage: getBgImageClass('/images/bg-sidebar-profile.png') }}
			>
				<div className="flex justify-between text-white">
					<SheetTitle className="text-white">Profile</SheetTitle>
					<SheetClose className="">
						<X />
					</SheetClose>
				</div>

				<div className="mt-6 flex gap-6">
					<div className="">
						<Image
							src={"/images/sidebar-tempava.png"}
							alt="avatar_placeholder"
							width={64}
							height={64}
						/>
					</div>
					<ProfileInfo />
				</div>
			</SheetHeader>
			<div className="pad pt-6 flex flex-col gap-6 overflow-y-auto flex-1">
				{Object.entries(PROFILE_MENU_ITEM).map(([title, items]) => (
					<Group key={title} title={title}>
						{items.map((item, index) => (
							<MenuItem key={index} item={item} />
						))}
					</Group>
				))}

				<div className="flex justify-center gap-2 cursor-pointer" onClick={handleLogout}>
					{/* <LogOut className="text-status-error" size={18} md:size={20} /> */}
					<Image src={"/icons/logout.svg"} alt="" height={20} width={20} className="md:h-5 md:w-5" />
					<p className="text-sm md:text-base font-medium text-status-error">Log Out</p>
				</div>
			</div>
		</div>
	);
};

export default Profile;
