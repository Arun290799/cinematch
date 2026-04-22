"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Error loading movies-like page:", error);
	}, [error]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-4">
			<div className="max-w-md text-center space-y-6">
				<div className="mx-auto h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center">
					<svg
						className="h-12 w-12 text-muted-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>

				<div className="space-y-2">
					<h1 className="text-3xl font-bold text-foreground">
						Something went wrong
					</h1>
					<p className="text-muted-foreground">
						We couldn't load the similar movies page. This might be a temporary issue.
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						onClick={reset}
						className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
					>
						Try again
					</button>
					<Link
						href="/"
						className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
					>
						Go to Home
					</Link>
				</div>

				{error.message && (
					<div className="rounded-lg bg-muted/50 border border-border p-4 text-left">
						<p className="text-xs font-mono text-muted-foreground">
							Error: {error.message}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
