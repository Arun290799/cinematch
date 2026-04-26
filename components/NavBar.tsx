"use client";

import Link from "next/link";
import { FC, useState, useEffect } from "react";
import { Heart, Menu, X, Mail, Film } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/src/context/AuthContext";
import { useWishlist } from "@/src/context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

type NavBarProps = {
	authed: boolean;
};

const NavBar: FC<NavBarProps> = ({ authed }) => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	// Use client auth state for instant reaction; fall back to server hint.
	const { isAuthenticated } = useAuth();
	const showAuthed = isAuthenticated ?? authed;
	const { wishlistIds } = useWishlist();

	// Close mobile menu when route changes
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [pathname]);

	// Add scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close mobile menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (isMobileMenuOpen && !target.closest(".mobile-menu-container")) {
				setIsMobileMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isMobileMenuOpen]);

	const navLinkClass = "relative px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-accent";
	const mobileNavLinkClass =
		"block w-full px-4 py-3 text-base font-medium transition-colors duration-200 hover:bg-muted";

	return (
		<>
			<header className={`fixed w-full z-50 transition-all duration-300 bg-card/80 backdrop-blur-sm`}>
				<nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						{/* Logo */}
						<div className="flex-shrink-0">
							<Link href="/" className="flex items-center space-x-3">
								<div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 shadow-lg shadow-purple-500/25">
									<Film className="w-5 h-5 text-white" />
								</div>
								<div className="relative">
									<span className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-tight">
										CineMatch
									</span>
								</div>
							</Link>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
							{showAuthed ? (
								<>
									<Link
										href="/wishlist"
										className={`${navLinkClass} ${
											pathname === "/wishlist" ? "text-accent" : "text-foreground"
										} flex items-center gap-1`}
									>
										<span>Watchlist</span>
										{wishlistIds.length > 0 && (
											<motion.span
												initial={{ scale: 0.8, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												className="flex items-center justify-center h-5 min-w-5 px-1 text-xs font-medium rounded-full bg-accent/20 text-accent"
											>
												{wishlistIds.length > 9 ? "9+" : wishlistIds.length}
											</motion.span>
										)}
									</Link>
									<Link
										href="/liked-movies"
										className={`${navLinkClass} ${
											pathname === "/liked-movies" ? "text-accent" : "text-foreground"
										}`}
									>
										Liked Movies
									</Link>
									<Link
										href="/recommendations"
										className={`${navLinkClass} ${
											pathname === "/recommendations" ? "text-accent" : "text-foreground"
										}`}
									>
										Recommendations
									</Link>
									<Link
										href="/contact"
										className={`${navLinkClass} ${
											pathname === "/contact" ? "text-accent" : "text-foreground"
										}`}
									>
										Contact
									</Link>
									<div className="ml-4">
										<LogoutButton initialAuthed={showAuthed} />
									</div>
								</>
							) : (
								<>
									<Link
										href="/contact"
										className={`${navLinkClass} ${
											pathname === "/contact" ? "text-accent" : "text-foreground"
										}`}
									>
										Contact
									</Link>
									<Link
										href="/login"
										className="rounded-lg bg-gradient-to-r from-accent to-accent-hover px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm hover:from-accent-hover hover:to-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-200"
									>
										Sign in
									</Link>
									<Link
										href="/signup"
										className="ml-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-200"
									>
										Sign up
									</Link>
								</>
							)}
						</div>

						{/* Mobile menu button */}
						<div className="flex md:hidden">
							<button
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
							>
								<span className="sr-only">Open main menu</span>
								{isMobileMenuOpen ? (
									<X className="block h-6 w-6" aria-hidden="true" />
								) : (
									<Menu className="block h-6 w-6" aria-hidden="true" />
								)}
							</button>
						</div>
					</div>
				</nav>

				{/* Mobile menu */}
				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className="md:hidden bg-card border-t border-border"
						>
							<div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
								{showAuthed ? (
									<>
										<Link
											href="/"
											className={`${mobileNavLinkClass} ${
												pathname === "/" ? "text-accent" : "text-foreground"
											}`}
										>
											Home
										</Link>
										<Link
											href="/wishlist"
											className={`${mobileNavLinkClass} ${
												pathname === "/wishlist" ? "text-accent" : "text-foreground"
											} flex items-center justify-between`}
										>
											<span>Watchlist</span>
											{wishlistIds.length > 0 && (
												<span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
													{wishlistIds.length > 9 ? "9+" : wishlistIds.length}
												</span>
											)}
										</Link>
										<Link
											href="/liked-movies"
											className={`${mobileNavLinkClass} ${
												pathname === "/liked-movies" ? "text-accent" : "text-foreground"
											}`}
										>
											Liked Movies
										</Link>
										<Link
											href="/recommendations"
											className={`${mobileNavLinkClass} ${
												pathname === "/recommendations" ? "text-accent" : "text-foreground"
											}`}
										>
											Recommendations
										</Link>
										<Link
											href="/contact"
											className={`${mobileNavLinkClass} ${
												pathname === "/contact" ? "text-accent" : "text-foreground"
											}`}
										>
											Contact
										</Link>
										<div className="pt-2 border-t border-border">
											<LogoutButton initialAuthed={showAuthed} />
										</div>
									</>
								) : (
									<>
										<Link
											href="/contact"
											className={`${mobileNavLinkClass} ${
												pathname === "/contact" ? "text-accent" : "text-foreground"
											}`}
										>
											Contact
										</Link>
										<Link
											href="/login"
											className="block w-full px-4 py-3 text-base font-medium text-center text-accent-foreground bg-gradient-to-r from-accent to-accent-hover rounded-md hover:from-accent-hover hover:to-accent transition-colors duration-200"
										>
											Sign in
										</Link>
										<Link
											href="/signup"
											className="block w-full px-4 py-3 mt-2 text-base font-medium text-center text-foreground bg-card border border-border rounded-md hover:bg-muted transition-colors duration-200"
										>
											Sign up
										</Link>
									</>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</header>
			{/* Add padding to account for fixed header */}
			<div className="h-16"></div>
		</>
	);
};

export default NavBar;
