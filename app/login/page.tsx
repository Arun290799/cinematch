"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Film, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
	const router = useRouter();
	const { refreshAuth } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data?.message || "Sign in failed");
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
		<div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12 overflow-hidden">
			{/* Decorative Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl" />
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl" />
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
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg shadow-indigo-500/25">
						<Film className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Sign in to access your personalized movie recommendations
					</p>
				</motion.div>

				{/* Form Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 p-8"
				>
					<form onSubmit={onSubmit} className="space-y-6">
						{/* Email Field */}
						<div className="space-y-2">
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Email address
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									id="email"
									name="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-all duration-200 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 hover:border-gray-400 dark:hover:border-gray-500"
									placeholder="you@example.com"
									required
								/>
							</div>
						</div>

						{/* Password Field */}
						<div className="space-y-2">
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									id="password"
									name="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-all duration-200 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 hover:border-gray-400 dark:hover:border-gray-500"
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
								className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3"
							>
								<p className="text-sm text-red-600 dark:text-red-400" role="alert">
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
									? "bg-gray-400 cursor-not-allowed"
									: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
							}`}
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									<span>Signing in...</span>
								</>
							) : (
								<>
									<span>Sign in</span>
									<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
								</>
							)}
						</button>
					</form>

					{/* Sign Up Link */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="mt-6 text-center"
					>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Don't have an account?{" "}
							<Link
								href="/signup"
								className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 inline-flex items-center gap-1 group"
							>
								Sign up
								<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
							</Link>
						</p>
					</motion.div>
				</motion.div>
			</motion.div>
		</div>
	);
}
