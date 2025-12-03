import React from "react";
interface LayoutProps {
	children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
	return (
		<div className="bg-background-section py-6">
			<div className="container-default">
				<div className="h-[calc(100vh-106px)] md:h-[calc(100vh-120px)] flex flex-col">
					{children}
				</div>
			</div>
		</div>
	);
};

export default Layout;
