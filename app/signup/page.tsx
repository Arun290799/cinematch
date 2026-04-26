"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { motion } from "framer-motion";
import { Film, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

export default function SignupPage() {
	const router = useRouter();
	const { refreshAuth } = useAuth();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data?.message || "Sign up failed");
			}

			await refreshAuth();
			router.push("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background px-4 py-12 overflow-hidden">
			{/* Decorative Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="relative w-full max-w-md z-10"
			>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.1, duration: 0.4 }}
					className="text-center mb-8"
				>
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-hover mb-4 shadow-lg shadow-accent/25">
						<Sparkles className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
					<p className="text-muted-foreground">Join us to get personalized movie recommendations</p>
				</motion.div>

				{/* Form Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-xl shadow-accent/10 p-8"
				>
					<form onSubmit={onSubmit} className="space-y-6">
						{/* Name Field */}
						<div className="space-y-2">
							<label htmlFor="name" className="block text-sm font-medium text-foreground">
								Full name
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input
									id="name"
									name="name"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 hover:border-accent"
									placeholder="Your name"
									required
								/>
							</div>
						</div>

						{/* Email Field */}
						<div className="space-y-2">
							<label htmlFor="email" className="block text-sm font-medium text-foreground">
								Email address
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input
									id="email"
									name="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 hover:border-accent"
									placeholder="you@example.com"
									required
								/>
							</div>
						</div>

						{/* Password Field */}
						<div className="space-y-2">
							<label htmlFor="password" className="block text-sm font-medium text-foreground">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input
									id="password"
									name="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 hover:border-accent"
									placeholder="••••••••"
									required
								/>
							</div>
						</div>

						{/* Error Message */}
						{error && (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3"
							>
								<p className="text-sm text-destructive" role="alert">
									{error}
								</p>
							</motion.div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className={`w-full group relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 ${
								isLoading
									? "bg-muted cursor-not-allowed"
									: "bg-gradient-to-r from-accent to-accent-hover hover:from-accent-hover hover:to-accent shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98]"
							}`}
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									<span>Creating account...</span>
								</>
							) : (
								<>
									<span>Sign up</span>
									<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
								</>
							)}
						</button>
					</form>

					{/* Sign In Link */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="mt-6 text-center"
					>
						<p className="text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link
								href="/login"
								className="font-semibold text-accent hover:text-accent-hover transition-colors duration-200 inline-flex items-center gap-1 group"
							>
								Sign in
								<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
							</Link>
						</p>
					</motion.div>
				</motion.div>
			</motion.div>
		</div>
	);
}
