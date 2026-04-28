"use client";

import { useTheme } from "@/src/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
			aria-label="Toggle theme"
		>
			{theme === "dark" ? (
				<Sun className="h-4 w-4 text-foreground" />
			) : (
				<Moon className="h-4 w-4 text-foreground" />
			)}
		</button>
	);
}
