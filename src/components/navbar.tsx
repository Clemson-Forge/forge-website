import { ThemeToggle } from "./theme-toggle";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
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
							<NavigationMenuLink href="/resources">
								Resources
							</NavigationMenuLink>
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
