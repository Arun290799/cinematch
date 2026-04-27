import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t border-border bg-card/50 backdrop-blur-sm">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<div className="flex items-center space-x-2">
						<span className="text-lg font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
							CineMatch
						</span>
						<span className="text-muted-foreground">© {new Date().getFullYear()}</span>
					</div>
					
					<nav className="flex items-center gap-6">
						<Link 
							href="/about" 
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							About
						</Link>
						<Link 
							href="/privacy" 
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Privacy Policy
						</Link>
						<Link 
							href="/terms" 
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Terms of Service
						</Link>
					</nav>
				</div>
			</div>
		</footer>
	);
}
