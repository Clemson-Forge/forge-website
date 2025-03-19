import { ThemeToggle } from "./theme-toggle";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "./ui/navigation-menu";

export default function NavBar() {
	return (
		<div className="fixed flex top-0 z-50 w-full border-b bg-background/95 backdrop-blur p-2">
			<div className="flex w-full">
				<NavigationMenu>
					<NavigationMenuList>
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
							<NavigationMenuLink href="/contact">
								Contact
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink href="/projects">
								Past Projects
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuTrigger>
								Resources
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<NavigationMenuLink href="/links">
									Quick Links
								</NavigationMenuLink>
								<NavigationMenuLink href="/posts">
									Posts & Minutes
								</NavigationMenuLink>
							</NavigationMenuContent>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			<div className="flex justify-end mr-2">
				<ThemeToggle />
			</div>
		</div>
	);
}
