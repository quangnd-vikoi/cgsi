import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { SheetManager } from "@/app/sidebar/SheetManager";

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
		<html lang="en" className="antialiased">
			<body className={`${inter.className}`}>
				<div className="flex flex-col min-h-screen">
					<header className="bg-white z-10">
						<Header />
						<SheetManager />
					</header>

					<main>{children}</main>

					<footer>
						<Footer />
					</footer>

					<Toaster position="bottom-right" />
				</div>
			</body>
		</html>
	);
}
