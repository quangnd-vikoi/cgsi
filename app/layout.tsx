import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
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
			<head>
				<link rel="preconnect" href="https://www.cgsi.com.sg" />
				<link rel="dns-prefetch" href="https://www.cgsi.com.sg" />
			</head>
			<body className={`${inter.className}`}>{children}</body>
		</html>
	);
}
