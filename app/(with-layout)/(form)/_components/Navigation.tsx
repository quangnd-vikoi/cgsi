"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Archive, ChevronDown, CircleCheck, Headset } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { useSheetStore } from "@/stores/sheetStore";

const MenuItem = ({ title, link }: { title: string; link: string }) => {
	const pathname = usePathname();
	const isActive = link === "/" ? pathname === "/" : pathname?.startsWith(link);

	return (
		<Link href={link} className="w-full">
			<DropdownMenuItem
				className={cn(
					"cursor-pointer px-3 py-[10px]",
					isActive ? "text-cgs-blue bg-status-selected" : "hover:bg-background-focus"
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
	const segment = pathname.split("/")[1] || "Home";
	const title = segment.charAt(0).toUpperCase() + segment.slice(1);

	return (
		<nav className="flex justify-between items-center">
			<div className="flex items-center gap-1">
				<div className="font-semibold text-lg">{title}</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<ChevronDown className="text-cgs-blue cursor-pointer" />
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-64 px-0 py-2" align="start">
						<MenuItem title="Securities" link={INTERNAL_ROUTES.SECURITIES} />
						<MenuItem title="Alternatives" link={INTERNAL_ROUTES.ALTERNATIVE} />
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex gap-4 items-center">
				<Button
					onClick={() => setOpenSheet("trading_representative")}
					className="hidden md:inline-flex border-1 border-stroke-secondary text-typo-primary rounded-sm px-3 py-1.5 text-sm bg-transparent hover:bg-transparent hover:opacity-75 font-normal transition-colors h-8"
				>
					<Headset className="text-icon-light" size={24} />
					<p className="hidden md:inline-block">Contact us</p>
				</Button>

				<Headset
					className="text-icon-light md:hidden cursor-pointer"
					size={24}
					onClick={() => setOpenSheet("trading_representative")}
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
