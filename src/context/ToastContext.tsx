"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type ToastContextValue = {
	showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [message, setMessage] = useState<string | null>(null);

	const showToast = useCallback((nextMessage: string) => {
		setMessage(nextMessage);
	}, []);

	useEffect(() => {
		if (!message) return;

		const timeout = window.setTimeout(() => setMessage(null), 5000);
		return () => window.clearTimeout(timeout);
	}, [message]);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{message && (
				<div
					role="alert"
					aria-live="assertive"
					className="fixed bottom-4 right-4 z-[100] max-w-sm rounded-xl border border-destructive/30 bg-card px-4 py-3 text-sm text-foreground shadow-xl"
				>
					{message}
				</div>
			)}
		</ToastContext.Provider>
	);
}

export function useToast(): ToastContextValue {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}
