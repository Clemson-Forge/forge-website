import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Clemson Forge",
	description: "Website for the club at Clemson University, Clemson Forge",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<ThemeToggle />
				</ThemeProvider>
			</body>
		</html>
	);
}
