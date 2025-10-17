"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import useToggle from "@/hooks/useToggle";
import { cn } from "@/lib/utils";
import { CircleCheck, Grip } from "lucide-react";
import { usePathname } from "next/navigation";

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

const MobileMenuItem = ({ title, link, active }: { title: string; link: string; active?: boolean }) => {
	const pathname = usePathname();
	const isActive = active ?? (link === "/" ? pathname === "/" : pathname?.startsWith(link));
	return (
		<Link
			href={link}
			className={cn(
				"cursor-pointer px-3 py-[10px]",
				isActive && "text-enhanced-blue bg-status-selected"
			)}
		>
			<div className="flex justify-between items-center">
				{title}
				{isActive && <CircleCheck className="text-enhanced-blue h-4 w-4" />}
			</div>
		</Link>
	);
};
const Header = () => {
	const [notiIcon, setNotiIcon] = React.useState("/icons/Notif-Light.svg");
	const { value: isMenuOpen, toggle } = useToggle(false);
	const handleNotiClick = () => {
		if (notiIcon === "/icons/Notif-Light.svg") {
			setNotiIcon("/icons/Notif-Light-Red.svg");
		} else {
			setNotiIcon("/icons/Notif-Light.svg");
		}
	};

	return (
		<div className="h-14 md:h-18 p-4 md:px- max-w-[1440px] xl:mx-auto">
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
						<div onClick={handleNotiClick}>
							<Image
								className="cursor-pointer w-6 h-6 md:w-8 md:h-8"
								src={notiIcon}
								alt="User"
								width={32}
								height={32}
							/>
						</div>
						<Image
							className="cursor-pointer w-6 h-6 md:w-8 md:h-8"
							src="/icons/Person.svg"
							alt="User"
							width={32}
							height={32}
						/>
					</div>
					<div className="hidden md:block w-[2px] h-8 bg-gray-300"></div>
					<Button
						variant={"default"}
						className="h-8 rounded-sm bg-enhanced-blue px-3 font-normal hover:bg-enhanced-blue/70 cursor-pointer"
					>
						<Image
							src="/icons/Charts.svg"
							alt="User"
							width={20}
							height={20}
							className="hidden md:block"
						/>
						Trade Now
					</Button>
					<div className="md:hidden">
						<div className="relative">
							<Grip
								onClick={toggle}
								className={cn("cursor-pointer w-6 h-6", isMenuOpen && "text-enhanced-blue")}
							/>
							{isMenuOpen && (
								<div className="absolute w-64 py-2 top-6 right-0 bg-white rounded-md  flex flex-col">
									<MobileMenuItem title="Home" link="/" />
									<MobileMenuItem title="Discover" link="/discover" />
									<MobileMenuItem title="Portfolio" link="/portfolio" />
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
