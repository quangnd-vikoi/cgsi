import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { SheetManager } from "@/components/sidebar/SheetManager";
const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "CSGI Project",
	description: "iTrade - Stock Trading App",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className}  antialiased`}>
				<div className="flex flex-col min-h-screen">
					<header className="bg-white">
						<Header />
						<SheetManager />
					</header>
					<main>{children}</main>
					<Toaster position="bottom-right" />
					<footer>
						<Footer />
					</footer>
				</div>
			</body>
		</html>
	);
}
