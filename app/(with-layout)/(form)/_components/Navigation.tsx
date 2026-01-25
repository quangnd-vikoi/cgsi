"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronUp, CircleCheck, Headset, Archive } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { useSheetStore } from "@/stores/sheetStore";
import { useState } from "react";

const MenuItem = ({ title, link }: { title: string; link: string }) => {
	const pathname = usePathname();
	const isActive = link === "/" ? pathname === "/" : pathname?.startsWith(link);

	return (
		<Link href={link} className="w-full">
			<DropdownMenuItem
				className={cn(
					"cursor-pointer px-3 py-[10px]",
					isActive ? "text-cgs-blue bg-status-selected" : "hover:bg-background-section"
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

const Navigation = () => {
	const pathname = usePathname();
	const router = useRouter();
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	// Determine current title based on pathname
	const isSecurities = pathname?.startsWith(INTERNAL_ROUTES.SECURITIES);
	const title = isSecurities ? "Initial Offering Price" : "Alternatives";

	const handleContactClick = () => {
		setOpenSheet("trading_representative");
	};

	return (
		<nav className="flex justify-between items-center">
			<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<button
						className={cn(
							"flex items-center gap-1 px-2 py-1 focus:outline-none transition-colors border-b-2 border-transparent min-w-0 max-w-[220px]",
							dropdownOpen && "bg-status-selected border-cgs-blue"
						)}
					>
						<span
							className={cn(
								"font-semibold text-lg truncate",
								dropdownOpen && "text-cgs-blue"
							)}
						>
							{title}
						</span>
						{dropdownOpen ? (
							<ChevronUp className="text-icon cursor-pointer h-5! w-5 shrink-0" />
						) : (
							<ChevronDown className="text-icon cursor-pointer h-5 w-5 shrink-0" />
						)}
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-64 relative bottom-1 px-0 py-rounded rounded shadow-light-blue border-none" align="start">
					<MenuItem title="Initial Offering Price" link={INTERNAL_ROUTES.SECURITIES} />
					<MenuItem title="Alternatives" link={INTERNAL_ROUTES.ALTERNATIVE} />
				</DropdownMenuContent>
			</DropdownMenu>

			<div className="flex gap-4 items-center">
				<Button
					onClick={handleContactClick}
					className="hidden md:inline-flex border-1 border-stroke-secondary text-typo-primary rounded-sm px-3 py-1.5 text-sm bg-transparent hover:bg-transparent hover:opacity-75 font-medium transition-colors h-8"
				>
					<Headset className="text-icon-light" size={24} />
					<p className="hidden md:inline-block">Contact Us</p>
				</Button>

				<Headset
					className="text-icon-light md:hidden cursor-pointer"
					size={24}
					onClick={handleContactClick}
				/>

				<Button
					onClick={() => router.push(INTERNAL_ROUTES.MYAPPLICATION)}
					className="h-fit md:h-8 border border-cgs-blue text-cgs-blue rounded-sm px-2 md:px-3 py-1 md:py-1.5 text-sm bg-transparent hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75 font-medium transition-colors "
				>
					<Archive />
					<p className="leading-4">My Applications</p>
				</Button>
			</div>
		</nav>
	);
};

export default Navigation;
