"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Archive, ChevronDown, CircleCheck, Headset } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MenuItem = ({ title, link }: { title: string; link: string }) => {
	const pathname = usePathname();
	const isActive = link === "/" ? pathname === "/" : pathname?.startsWith(link);

	return (
		<Link href={link} className="w-full">
			<DropdownMenuItem
				className={cn(
					"cursor-pointer px-3 py-[10px]",
					isActive ? "text-enhanced-blue bg-status-selected" : "hover:bg-background-focus"
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

const Navigation = () => {
	const pathname = usePathname();

	const segment = pathname.split("/")[1] || "Home";
	const title = segment.charAt(0).toUpperCase() + segment.slice(1);

	return (
		<nav className="flex justify-between items-center">
			<div className="flex items-center gap-1">
				<div className="font-semibold text-lg">{title}</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<ChevronDown className="text-enhanced-blue cursor-pointer" />
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-64 px-0 py-2" align="start">
						<MenuItem title="Securities" link="/securities" />
						<MenuItem title="Alternatives" link="/alternatives" />
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex gap-4 items-center">
				<Button className="border-0 md:border border-stroke-secondary text-typo-primary rounded-sm px-0 py-0 md:px-3 md:py-1.5 text-sm bg-transparent hover:bg-black/5 font-normal transition-colors">
					<Headset className="text-icon-light" />
					<p className="hidden md:inline-block">Contact us</p>
				</Button>
				<Button className="h-fit border border-enhanced-blue text-enhanced-blue rounded-sm px-2 md:px-3 py-1 md:py-1.5 text-sm bg-transparent hover:bg-blue-500/10 font-medium transition-colors ">
					<Archive />
					<p className="leading-4">My Applications</p>
				</Button>
			</div>
		</nav>
	);
};

export default Navigation;
