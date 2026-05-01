"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

export default function SignInSuggestion() {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return null;
	}

	return (
		<section className="bg-gradient-to-br from-accent/5 via-background to-accent-hover/5 w-full border-t border-border">
			<div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
								<Heart className="h-6 w-6 text-accent" />
							</div>
							<div className="text-left">
								<h3 className="text-lg font-semibold text-foreground mb-1">
									Unlock Personalized Experience
								</h3>
								<p className="text-sm text-muted-foreground">
									Sign in to like movies, build your watchlist, and get AI-powered recommendations
								</p>
							</div>
						</div>
						<Link
							href="/login"
							className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-all hover:scale-105"
						>
							Sign In
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
