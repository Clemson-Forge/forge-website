import { ThemeToggle } from "./theme-toggle";

export default function NavBar() {
	return (
		<div className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
			<div className="flex justify-end mr-2">
				<ThemeToggle />
			</div>
		</div>
	);
}
