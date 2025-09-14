import type { Metadata } from "next";
import { Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import RESUME from "@/data/resume";

const lora = Lora({
	variable: "--font-lora",
	subsets: ["latin"],
	weight: ["400", "700"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: `${RESUME.name}`,
	description: `${RESUME.bio.intro}`,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={`${lora.variable} ${geistMono.variable}`}
			lang="en"
			suppressHydrationWarning
		>
			<Script
				data-website-id="44b7a203-2f5e-4e57-abba-1988d082ddfd"
				defer
				src="https://umami.ajanraj.com/script.js"
			/>
			<body className="antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					disableTransitionOnChange
					forcedTheme="dark"
				>
					<div className="mx-auto max-w-screen-md border-x border-dashed pt-10 md:pt-20">
						{/* <div className="max-w-screen-md mx-auto pt-10 md:pt-20 px-4 sm:px-6 lg:px-8 border-x border-dashed"> */}
						<Nav />
						{children}
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
