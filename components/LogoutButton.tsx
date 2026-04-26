"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

type LogoutButtonProps = {
	/** Optional initial auth hint from server to reduce flicker */
	initialAuthed?: boolean;
};

const LogoutButton = ({ initialAuthed }: LogoutButtonProps) => {
	const router = useRouter();
	const { isAuthenticated, refreshAuth } = useAuth();
	const [loading, setLoading] = useState(false);

	const shouldShow = isAuthenticated || initialAuthed;
	if (!shouldShow) return null;

	const handleLogout = async () => {
		setLoading(true);
		try {
			await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			await refreshAuth();
			router.push("/login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handleLogout}
			disabled={loading}
			className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium text-accent-foreground transition ${
				loading ? "bg-muted cursor-not-allowed" : "bg-accent hover:bg-accent-hover cursor-pointer"
			}`}
		>
			{loading ? "Logging out..." : "Logout"}
		</button>
	);
};

export default LogoutButton;
