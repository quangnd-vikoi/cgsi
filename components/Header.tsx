"use client";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import Image from "@/components/Image";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CircleCheck, Grip } from "lucide-react";
import { usePathname } from "next/navigation";
import { redirectToNTP } from "@/lib/services/ssoService";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TriangleAlert, X } from "lucide-react";
import { useSheetStore } from "@/stores/sheetStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { SheetType } from "@/types";
import { CGSI, INTERNAL_ROUTES } from "@/constants/routes";
import HeaderPerson from "@/public/icons/CustomPerson.svg";

const MenuItem = ({ title, link }: { title: string; link: string }) => {
	const pathname = usePathname();
	const isActive = link === "/" ? pathname === "/" : pathname?.startsWith(link);
	return (
		<Link
			href={link}
			aria-current={isActive ? "page" : undefined}
			className={cn(
				"cursor-pointer font-medium text-typo-primary text-[18px] relative inline-block after:content-[''] after:absolute after:w-full after:h-[2px] after:-bottom-1 after:left-0 after:bg-cgs-blue after-origin-left after:transition-transform after:duration-300 after:ease-out",
				isActive ? "text-cgs-blue after:scale-x-100" : "hover:after:scale-x-100 after:scale-x-0"
			)}
		>
			{title}
		</Link>
	);
};

const MobileMenuItem = ({ title, link }: { title: string; link: string }) => {
	const pathname = usePathname();
	const isActive = link === "/" ? pathname === "/" : pathname?.startsWith(link);
	return (
		<Link href={link} className="w-full">
			<DropdownMenuItem
				className={cn(
					"cursor-pointer px-3 py-[10px]",
					isActive && "text-cgs-blue bg-status-selected"
				)}
			>
				<div className="flex justify-between items-center w-full">
					{title}
					{isActive && <CircleCheck className="text-cgs-blue h-4 w-4" />}
				</div>
			</DropdownMenuItem>
		</Link>
	);
};

interface AnnouncementItem {
	Announcement_Desc: string;
	Anchor_Link: string;
}

const AnnouncementBar = ({ setOpenSheet }: { setOpenSheet: (sheetType: SheetType, payload?: unknown) => void }) => {
	const [announcement, setAnnouncement] = useState<AnnouncementItem | null>(null);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const fetchAnnouncements = async () => {
			try {
				const response = await fetchAPI<AnnouncementItem[]>(ENDPOINTS.announcements());
				if (response.success && response.data && response.data.length > 0) {
					const items = response.data.slice(0, 3);
					const randomItem = items[Math.floor(Math.random() * items.length)];
					setAnnouncement(randomItem);

					// Check if this announcement was previously hidden
					const storageKey = `announcement-hidden-${randomItem.Anchor_Link}`;
					const wasHidden = localStorage.getItem(storageKey);
					setIsVisible(!wasHidden);
				}
			} catch (error) {
				console.error("Failed to fetch announcements:", error);
			}
		};

		fetchAnnouncements();
	}, []);

	const handleClose = () => {
		if (announcement) {
			const storageKey = `announcement-hidden-${announcement.Anchor_Link}`;
			localStorage.setItem(storageKey, "true");
			setIsVisible(false);
		}
	};

	if (!announcement || !isVisible) return null;

	return (
		<div className="bg-status-warning w-full px-4 py-2 relative">
			<div className="flex justify-center items-center gap-4 max-w-[1320px] mx-auto">
				<TriangleAlert size={16} className="shrink-0" />
				<p className="text-xs text-typo-primary line-clamp-2 md:line-clamp-1 flex-1 min-w-0">
					{announcement.Announcement_Desc}
				</p>
				<div className="flex gap-4 shrink-0">
					<div
						className="text-xs font-semibold underline cursor-pointer"
						onClick={() => setOpenSheet("announcement", { anchor_link: announcement.Anchor_Link })}
					>
						Learn More
					</div>
					<X size={16} className="block cursor-pointer" onClick={handleClose} />
				</div>
			</div>
		</div>
	);
};

const Header = () => {
	const openSheet = useSheetStore((state) => state.openSheet);
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);
	const unreadCount = useNotificationStore((state) => state.unreadCount);
	const pathName = usePathname();

	const handleTradeNowClick = async () => {
		// await redirectToNTP();
		window.open(CGSI.TRADE, "_blank");
	};

	const isIconFill = !["/", "/discover", "/portfolio"].includes(pathName);

	const handleSheetOpen = (type: "profile" | "notification") => {
		if (type == "profile") setOpenSheet("profile");
		else setOpenSheet("notification");
	};
	return (
		<>
			<div className="p-4 xl:px-0 max-w-[1320px] xl:mx-auto z-30">
				<div className="flex justify-between h-full">
					<div className="flex items-center my-auto gap-12">
						<Link href={"/"}>
							<Image
								src="/icons/iTrade-header.svg"
								alt="Logo"
								width={75}
								height={23}
								className="object-contain"
							/>
						</Link>

						<div className="hidden md:flex gap-6">
							<MenuItem title="Home" link={INTERNAL_ROUTES.HOME} />
							<MenuItem title="Discover" link={INTERNAL_ROUTES.DISCOVER} />
							<MenuItem title="Portfolio" link={INTERNAL_ROUTES.PORFOLIO} />
						</div>
					</div>

					<div className="flex items-center my-auto gap-4 md:gap-6">
						<div className="flex gap-4 md:gap-6">
							<div onClick={() => handleSheetOpen("notification")} className="relative">
								<Image
									className="cursor-pointer w-6 md:w-8"
									src={
										unreadCount > 0
											? "/icons/header/Notif-Light-Red.svg"
											: "/icons/header/Notif-Light.svg"
									}
									alt="Notification"
									width={32}
									height={32}
								/>
							</div>
							<div onClick={() => handleSheetOpen("profile")}>
								<HeaderPerson
									className={cn(
										"cursor-pointer w-6 md:w-8",
										(openSheet && openSheet != "notification")
											? "text-cgs-blue"
											: isIconFill
												? "text-cgs-blue [&_path]:fill-cgs-blue"
												: "text-icon-light"
									)}
								/>
							</div>
						</div>
						<div className="hidden md:block w-[2px] h-8 bg-stroke-secondary"></div>
						<Button
							onClick={handleTradeNowClick}
							variant={"default"}
							className="h-8 rounded bg-cgs-blue px-2 md:px-3 font-normal hover:bg-cgs-blue/70 text-xs md:text-sm"
						>
							<Image
								src="/icons/Charts.svg"
								alt="Trade Now"
								width={20}
								height={20}
								className="hidden md:block"
							/>
							<span>Trade Now</span>
						</Button>
						<div className="md:hidden">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="h-6 w-6 md:h-8 md:w-8 p-0 data-[state=open]:text-cgs-blue text-typo-secondary"
									>
										<Grip className="w-6 md:w-8" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-64 px-0" align="end">
									<MobileMenuItem title="Home" link={INTERNAL_ROUTES.HOME} />
									<MobileMenuItem title="Discover" link={INTERNAL_ROUTES.DISCOVER} />
									<MobileMenuItem title="Portfolio" link={INTERNAL_ROUTES.PORFOLIO} />
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</div>

			<AnnouncementBar setOpenSheet={setOpenSheet} />
		</>
	);
};

export default Header;
