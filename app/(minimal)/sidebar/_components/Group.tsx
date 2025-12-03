import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GroupProps = {
	title: string;
	children: ReactNode;
	childrenClassName?: string;
};

const Group = ({ title, children, childrenClassName }: GroupProps) => {
	return (
		<div className="relative p-4 pt-6 border rounded-xl w-full">
			<div className="top-0 left-0 absolute bg-theme-blue-09 px-2 py-1 rounded-sm font-normal text-xs -translate-y-1/2">
				{title}
			</div>
			<div className={cn("flex flex-col gap-6", childrenClassName)}>{children}</div>
		</div>
	);
};

export default Group;
