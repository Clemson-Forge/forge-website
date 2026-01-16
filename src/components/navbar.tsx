"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import supabase from "@/lib/supabase";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "./ui/navigation-menu";

export default function NavBar() {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [authLabel, setAuthLabel] = useState("Sign In");

	useEffect(() => {
		let isMounted = true;
		supabase.auth.getSession().then(({ data }) => {
			if (!isMounted) return;
			if (data.session) {
				setAuthLabel("Profile");
			}
		});
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setAuthLabel(session ? "Profile" : "Sign In");
		});
		return () => {
			isMounted = false;
			subscription.unsubscribe();
		};
	}, []);

	const navLinks: { href: string; label: string }[] = [
		{ href: "/", label: "Home" },
		{ href: "/about", label: "About" },
		{ href: "/members", label: "Members" },
		// { href: "/apply", label: "Apply" },
		// { href: "/contact", label: "Contact" },
		{ href: "/resources", label: "Resources" },
	];

	const handleAuthNav = async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		router.push(session ? "/profile" : "/signin");
		setIsMenuOpen(false);
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<div className="fixed flex top-0 z-50 w-full border-b bg-background/95 backdrop-blur p-2">
			<div className="flex w-1/6 justify-center">
				<Image
					src="/assets/logo.png"
					alt="logo"
					width={75}
					height={75}
				/>
			</div>

			<div className="hidden sm:flex w-2/3 justify-center">
				<NavigationMenu>
					<NavigationMenuList className="flex lg:space-x-16 md:space-x-8 sm:space-x-2">
						{navLinks.map((link) => (
							<NavigationMenuItem key={link.href}>
								<NavigationMenuLink href={link.href}>
									{link.label}
								</NavigationMenuLink>
							</NavigationMenuItem>
						))}
						<NavigationMenuItem>
							<NavigationMenuLink asChild>
								<button
									type="button"
									onClick={handleAuthNav}
									className="rounded-md px-4 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground hover:cursor-pointer"
								>
									{authLabel}
								</button>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			<div className="hidden sm:flex mr-4 items-center ml-auto">
				<ThemeToggle />
			</div>

			<div className="md:hidden flex grow justify-end items-center">
				<button onClick={toggleMenu} className="p-2">
					{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
				<ThemeToggle />
			</div>

			{isMenuOpen && (
				<div className="absolute top-full w-1/4 right-0 bg-background sm:hidden">
					<nav className="flex flex-col p-4">
						<NavigationMenu>
							<NavigationMenuList className="flex flex-col">
								{navLinks.map((link) => (
									<NavigationMenuItem key={link.href}>
										<NavigationMenuLink
											className="py-2"
											href={link.href}
										>
											{link.label}
										</NavigationMenuLink>
									</NavigationMenuItem>
								))}
								<NavigationMenuItem>
									<NavigationMenuLink asChild>
										<button
											type="button"
											onClick={handleAuthNav}
											className="py-2 text-left text-sm font-medium hover:cursor-pointer"
										>
											{authLabel}
										</button>
									</NavigationMenuLink>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
					</nav>
				</div>
			)}
		</div>
	);
}
