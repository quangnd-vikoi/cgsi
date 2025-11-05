import React from "react";
interface LayoutProps {
	children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
	return (
		<div className="bg-background-section h-[calc(100vh-72px)] py-6">
			<div className="container-default h-full">{children}</div>
		</div>
	);
};

export default Layout;
