import React, { ReactNode, Children } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type GroupProps = {
	title: string;
	children: ReactNode;
	childrenClassName?: string;
	showSeparator?: boolean;
};

const Group = ({ title, children, childrenClassName, showSeparator = true }: GroupProps) => {
	const childArray = Children.toArray(children);
	const shouldShowSeparator = showSeparator && childArray.length > 1;

	return (
		<div className="w-full">
			<div className="bg-theme-blue-09 px-2 py-1 rounded-t font-medium text-xs border border-b-0 border-theme-blue-09 w-fit text-typo-tertiary">
				{title}
			</div>
			<div className={cn("flex flex-col border rounded rounded-tl-none", childrenClassName)}>
				{childArray.map((child, index) => (
					<React.Fragment key={index}>
						<div className="">{child}</div>
						{shouldShowSeparator && index < childArray.length - 1 && (
							<div className="px-4">
								<Separator className="" />
							</div>
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default Group;
