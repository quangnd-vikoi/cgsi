"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CircleCheck, Grip } from "lucide-react";
import { usePathname } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TriangleAlert, X } from "lucide-react";
import useToggle from "@/hooks/useToggle";
import { useSheetStore } from "@/stores/sheetStore";
import { SheetType } from "@/types";
import { CGSI, INTERNAL_ROUTES } from "@/constants/routes";
const MenuItem = ({ title, link }: { title: string; link: string }) => {
	const pathname = usePathname();
	const isActive = link === "/" ? pathname === "/" : pathname?.startsWith(link);
	return (
		<Link
			href={link}
			aria-current={isActive ? "page" : undefined}
			className={cn(
				"cursor-pointer font-medium text-typo-primary text-[18px] relative inline-block after:content-[''] after:absolute after:w-full after:h-[2px] after:-bottom-1 after:left-0 after:bg-enhanced-blue after-origin-left after:transition-transform after:duration-300 after:ease-out",
				isActive ? "text-enhanced-blue after:scale-x-100" : "hover:after:scale-x-100 after:scale-x-0"
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
					isActive && "text-enhanced-blue bg-status-selected"
				)}
			>
				<div className="flex justify-between items-center w-full">
					{title}
					{isActive && <CircleCheck className="text-enhanced-blue h-4 w-4" />}
				</div>
			</DropdownMenuItem>
		</Link>
	);
};

const AnnouncementBar = ({ setOpenSheet }: { setOpenSheet: (sheetType: SheetType) => void }) => {
	const { value, setFalse } = useToggle(true);
	return (
		<div
			className={cn("bg-status-warning w-full px-4 md:px-14 py-2 relative", value ? "block" : "hidden")}
		>
			<div className="flex justify-center items-center gap-4">
				<TriangleAlert size={16} className="shrink-0" />
				<p className="text-xs text-typo-primary text-ellipsis line-clamp-2 md:line-clamp-1 ">
					iTrade+ Maintenance Unavailable at 30-Aug-2025, 06:00 - 13:30
				</p>
				<div className="flex gap-4 shrink-0">
					<div
						className="text-xs font-semibold underline cursor-pointer"
						onClick={() => setOpenSheet("announcement")}
					>
						Learn More
					</div>
					<X size={16} className="block md:hidden" onClick={() => setFalse()} />
				</div>
			</div>

			<X size={16} className="hidden md:block absolute right-4 top-2" onClick={() => setFalse()} />
		</div>
	);
};

const Header = () => {
	const openSheet = useSheetStore((state) => state.openSheet);
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);

	const handleOpenSheet = (type: SheetType) => {
		setOpenSheet(type);
	};

	return (
		<>
			<div className="p-4 md:px-10 md:py-5 max-w-[1440px] xl:mx-auto z-[100]">
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
							<div onClick={() => handleOpenSheet("notification")}>
								<Image
									className="cursor-pointer w-6 md:w-8"
									src={
										openSheet === "notification"
											? "/icons/header/Notif-Light.svg"
											: "/icons/header/Notif-Light-Red.svg"
									}
									alt="Notification"
									width={32}
									height={32}
								/>
							</div>
							<div onClick={() => handleOpenSheet("profile")}>
								<Image
									className="cursor-pointer w-6 md:w-8"
									src="/icons/Person.svg"
									alt="User"
									width={32}
									height={32}
								/>
							</div>
						</div>
						<div className="hidden md:block w-[2px] h-8 bg-gray-300"></div>
						<Link href={CGSI.TRADE} className="" target="_blank">
							<Button
								variant={"default"}
								className="h-6 md:h-8 rounded-sm bg-enhanced-blue px-2 md:px-3 font-normal hover:bg-enhanced-blue/70 text-xs md:text-sm"
							>
								<Image
									src="/icons/Charts.svg"
									alt="User"
									width={20}
									height={20}
									className="hidden md:block"
								/>
								<span>Trade Now</span>
							</Button>
						</Link>
						<div className="md:hidden">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Grip className="cursor-pointer w-6 md:w-8 data-[state=open]:text-enhanced-blue text-typo-secondary" />
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
