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
import { getCorporateActionURL } from "@/lib/services/ssoService";

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
				<div className="text-sm font-normal">{item.name}</div>
			</div>
			<ChevronRight className="w-5 text-enhanced-blue" strokeWidth={2} />
		</>
	);

	// Render Link for href items (without onClick)
	if (item.href && !item.onClick) {
		return (
			<Link href={item.href} target={item.target || "_self"} className="flex justify-between">
				{content}
			</Link>
		);
	}

	// Render clickable div for onClick or sheet items
	if (item.onClick || item.sheet !== undefined) {
		return (
			<div
				className={`flex justify-between cursor-pointer ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
				onClick={handleClick}
			>
				{content}
			</div>
		);
	}

	// Fallback for items without actions
	return <div className="flex justify-between">{content}</div>;
};

const Profile = () => {
	const PROFILE_MENU_ITEM = {
		"Account Centre": [
			{
				icon: <CircleUserRound />,
				name: "User Profile",
				sheet: "user_profile" as SheetType,
			},
			{
				icon: <ShieldCheck />,
				name: "Password & Security",
				sheet: "password_and_security" as SheetType,
			},
			{
				icon: <HeartHandshake />,
				name: "Donations",
				href: "/donations",
			},
		],
		"Trading Centre": [
			{
				icon: <BookOpen />,
				name: "Trading Accounts",
				sheet: "trading_accounts" as SheetType,
			},
			{
				icon: <FileCheck />,
				name: "Trading Declarations",
				sheet: "trading_declarations" as SheetType,
			},
			{
				icon: <Building2 />,
				name: "Corporate Actions",
				onClick: getCorporateActionURL,
			},
			{
				icon: <Box />,
				name: "Market Data & Add-Ons",
				href: "/market-data",
			},
			{
				icon: <Boxes />,
				name: "My Subscriptions",
				sheet: "my_subscriptions" as SheetType,
			},
		],
		Reports: [
			{
				icon: <FileText />,
				name: "eStatements",
				href: CGSI.ESTATEMENT,
				target: "_blank" as IProfileMenuItem["target"],
			},
			{
				icon: <FileCheck />,
				name: "Acknowledgements",
				sheet: "acknowledgements" as SheetType,
			},
		],
		"Help & Support": [
			{
				icon: <Headphones />,
				name: "Contact Us",
				sheet: "contact" as SheetType,
			},
			{
				icon: <CircleQuestionMark />,
				name: "Help Centre",
				href: CGSI.HELP_CENTRE,
				target: "_blank" as IProfileMenuItem["target"],
			},
			{
				icon: <Settings />,
				name: "Settings",
				href: "/settings",
			},
		],
	};

	return (
		<div className="h-full flex flex-col">
			<SheetHeader
				className="text-base lg:text-lg p-6 bg-cover rounded-tl-md flex-shrink-0"
				style={{ backgroundImage: getBgImageClass('/images/bg-sidebar-profile.png') }}
			>
				<div className="flex justify-between text-white">
					<SheetTitle className="text-white">Profile Centre</SheetTitle>
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
					<div className="flex flex-col gap-1.5 text-white">
						<p className="text-base font-semibold">rayrayhanabhirama28</p>
						<p className="text-xs font-normal">rayhan.abhir@gmail.com</p>
						<p className="text-xs font-normal">+62 81234567899</p>
					</div>
				</div>
			</SheetHeader>
			<div className="pad pt-6 md:pt-10 flex flex-col gap-10 overflow-y-auto flex-1">
				{Object.entries(PROFILE_MENU_ITEM).map(([title, items]) => (
					<Group key={title} title={title}>
						{items.map((item, index) => (
							<MenuItem key={index} item={item} />
						))}
					</Group>
				))}

				<div className="-mt-3 flex justify-center gap-2 cursor-pointer">
					{/* <LogOut className="text-status-error" size={18} /> */}
					<Image src={"/icons/logout.svg"} alt="" height={18} width={18} />
					<p className="text-sm font-medium text-status-error">Log Out</p>
				</div>
			</div>
		</div>
	);
};

export default Profile;
