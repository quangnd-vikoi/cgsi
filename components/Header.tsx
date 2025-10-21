"use client";
import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Notification from "./sidebar/Notification";
import Profile from "./sidebar/Profile";
import { TriangleAlert, X } from "lucide-react";
import Announcements from "./sidebar/Announcements";
import useToggle from "@/hooks/useToggle";
type SheetType = "notification" | "profile" | "annoucement" | null;

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

const AnnouncementBar = ({ setOpenSheet }: { setOpenSheet: Dispatch<SetStateAction<SheetType>> }) => {
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
						onClick={() => setOpenSheet("annoucement")}
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
	const [openSheet, setOpenSheet] = React.useState<SheetType>(null);

	const handleOpenSheet = (type: SheetType) => {
		setOpenSheet(type);
	};

	const handleCloseSheet = () => {
		setOpenSheet(null);
	};

	return (
		<>
			<div className="p-4 md:px-10 md:py-5 max-w-[1440px] xl:mx-auto z-[100]">
				<div className="flex justify-between h-full">
					<div className="flex items-center my-auto gap-12">
						<Image
							src="/icons/iTrade-header.svg"
							alt="Logo"
							width={75}
							height={23}
							className="object-contain"
						/>

						<div className="hidden md:flex gap-6">
							<MenuItem title="Home" link="/" />
							<MenuItem title="Discover" link="/discover" />
							<MenuItem title="Portfolio" link="/portfolio" />
						</div>
					</div>

					<div className="flex items-center my-auto gap-4 md:gap-6">
						<div className="flex gap-4 md:gap-6">
							<div onClick={() => handleOpenSheet("notification")}>
								<Image
									className="cursor-pointer w-6 md:w-8"
									src={
										openSheet === "notification"
											? "/icons/Notif-Light-Red.svg"
											: "/icons/Notif-Light.svg"
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
						<div className="md:hidden">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Grip className="cursor-pointer w-6 md:w-8 data-[state=open]:text-enhanced-blue text-typo-secondary" />
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-64 px-0" align="end">
									<MobileMenuItem title="Home" link="/" />
									<MobileMenuItem title="Discover" link="/discover" />
									<MobileMenuItem title="Portfolio" link="/portfolio" />
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</div>

			<AnnouncementBar setOpenSheet={setOpenSheet} />
			{/* Notification Sheet */}
			<Sheet  open={openSheet != null} onOpenChange={handleCloseSheet}>
				<SheetContent
					side="right"
					className={cn(
						"w-[352px] lg:w-[432px] rounded-l-lg border border-stroke-secondary border-r-0 top-[56px] md:top-[72px] h-[calc(100vh-56px)] md:h-[calc(100vh-72px)] px-4 md:px-6 py-6 focus:outline-none",
						openSheet === "profile" && "p-0 px-0"
					)}
				>
					{openSheet === "notification" && <Notification />}
					{openSheet === "profile" && <Profile />}
					{openSheet === "annoucement" && <Announcements />}
				</SheetContent>
			</Sheet>
		</>
	);
};

export default Header;
