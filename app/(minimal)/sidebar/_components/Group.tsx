import React, { ReactNode, Children } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type GroupProps = {
	title: string;
	children: ReactNode;
	childrenClassName?: string;
};

const Group = ({ title, children, childrenClassName }: GroupProps) => {
	const childArray = Children.toArray(children);

	return (
		<div className="w-full">
			<div className="bg-theme-blue-09 px-2 py-1 rounded-t font-medium text-xs border border-b-0 border-theme-blue-09 w-fit text-typo-tertiary">
				{title}
			</div>
			<div className={cn("flex flex-col border rounded rounded-tl-none", childrenClassName)}>
				{childArray.map((child, index) => (
					<React.Fragment key={index}>
						<div className="">{child}</div>
						<div className="px-4">
							{index < childArray.length - 1 && <Separator className="" />}
						</div>
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default Group;
