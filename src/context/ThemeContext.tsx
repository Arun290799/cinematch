"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";

type ThemeContextValue = {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
	children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>("dark");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const savedTheme = localStorage.getItem("theme") as Theme | null;

		const initialTheme = savedTheme || "dark";
		setThemeState(initialTheme);
		applyTheme(initialTheme);
	}, []);

	const applyTheme = (newTheme: Theme) => {
		const root = document.documentElement;
		if (newTheme === "light") {
			root.classList.add("light");
		} else {
			root.classList.remove("light");
		}
	};

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		localStorage.setItem("theme", newTheme);
		applyTheme(newTheme);
	};

	const toggleTheme = () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
	};

	const value: ThemeContextValue = {
		theme,
		toggleTheme,
		setTheme,
	};

	if (!mounted) {
		return <>{children}</>;
	}

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		return {
			theme: "dark",
			toggleTheme: () => {},
			setTheme: () => {},
		};
	}
	return ctx;
}
