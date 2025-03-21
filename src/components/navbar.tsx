"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "./ui/navigation-menu";

export default function NavBar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

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
					<NavigationMenuList className="flex lg:space-x-16 md:space-x-8 sm:space-x-4">
						<NavigationMenuItem>
							<NavigationMenuLink href="/">
								Home
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink href="/about">
								About
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink href="/members">
								Members
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink href="/contact">
								Contact
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink href="/resources">
								Resources
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			<div className="hidden sm:flex mr-4 items-center ml-auto">
				<ThemeToggle />
			</div>

			<div className="sm:hidden flex flex-grow justify-end items-center">
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
								<NavigationMenuItem>
									<NavigationMenuLink
										className="py-2"
										href="/"
									>
										Home
									</NavigationMenuLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuLink
										className="py-2"
										href="/about"
									>
										About
									</NavigationMenuLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuLink
										className="py-2"
										href="/contact"
									>
										Contact
									</NavigationMenuLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuLink
										className="py-2"
										href="/members"
									>
										Members
									</NavigationMenuLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuLink
										className="py-2"
										href="/resources"
									>
										Resources
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
