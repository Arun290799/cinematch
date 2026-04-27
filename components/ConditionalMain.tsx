"use client";

import { usePathname } from "next/navigation";

type ConditionalMainProps = {
	children: React.ReactNode;
};

export default function ConditionalMain({ children }: ConditionalMainProps) {
	const pathname = usePathname();
	const isAuthPage = pathname === "/login" || pathname === "/signup";
	const isHomePage = pathname === "/";

	if (isAuthPage) {
		return <>{children}</>;
	}

	if (isHomePage) {
		return <main className="w-full">{children}</main>;
	}

	return <main className="mx-auto max-w-5xl py-4 sm:py-6">{children}</main>;
}
