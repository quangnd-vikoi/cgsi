import React, { ReactNode } from "react";

type GroupProps = {
	title: string;
	children: ReactNode;
};

const Group = ({ title, children }: GroupProps) => {
	return (
		<div className="w-full border rounded-xl p-4 pt-6 relative">
			<div className="absolute px-2 py-1 bg-theme-blue-09 text-xs font-normal top-0 left-0 -translate-y-1/2 rounded-sm">
				{title}
			</div>
			<div className="flex flex-col gap-6">{children}</div>
		</div>
	);
};

export default Group;
