import Link from "next/link";
import { Play, Sparkles, Heart, TrendingUp, Users, Zap, ArrowRight } from "lucide-react";
import PopularMoviesSection from "./discover/PopularMoviesSection";
import SignInSuggestion from "@/components/SignInSuggestion";

export const metadata = {
	title: "CineMatch - AI-Powered Movie Recommendations | Discover Your Next Favorite Film",
	description:
		"Find your next favorite movie with CineMatch's AI-powered recommendations. Personalized suggestions based on your taste. Start discovering today for free.",
	keywords: [
		"movie recommendations",
		"AI movie suggestions",
		"discover movies",
		"personalized movies",
		"movie discovery",
		"find movies to watch",
	],
	openGraph: {
		title: "CineMatch - AI-Powered Movie Recommendations",
		description:
			"Find your next favorite movie with CineMatch's AI-powered recommendations. Personalized suggestions based on your taste.",
		type: "website",
	},
};

export default function Home() {
	return (
		<div>
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-gradient-to-br from-accent/10 via-background to-accent-hover/5 w-full">
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-40">
					<div className="text-center">
						<div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
							<Sparkles className="h-4 w-4" />
							AI-Powered Movie Discovery
						</div>
						<h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
							Discover Movies <br className="hidden sm:block" />
							<span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
								You'll Love
							</span>
						</h1>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl mb-10">
							Stop scrolling endlessly. Get personalized movie recommendations tailored to your unique
							taste with our AI-powered platform.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Link
								href="/discover"
								className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 text-base font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
							>
								<Play className="h-5 w-5" />
								Start Discovering
							</Link>
							<Link
								href="/about"
								className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-8 py-3 text-base font-semibold text-foreground hover:bg-card/80 transition-colors"
							>
								Learn More
								<ArrowRight className="h-5 w-5" />
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="bg-background w-full">
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
							Why Choose CineMatch?
						</h2>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
							Experience movie discovery like never before with our intelligent features
						</p>
					</div>
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
						<div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-300 group">
							<div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 mb-4 group-hover:bg-purple-500/20 transition-colors">
								<Sparkles className="h-6 w-6 text-purple-500" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-purple-500 transition-colors">
								AI-Powered
							</h3>
							<p className="text-muted-foreground">
								Advanced algorithms learn your preferences to suggest movies you'll actually enjoy
								watching.
							</p>
						</div>
						<div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-300 group">
							<div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10 mb-4 group-hover:bg-pink-500/20 transition-colors">
								<Heart className="h-6 w-6 text-pink-500" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-pink-500 transition-colors">
								Personalized
							</h3>
							<p className="text-muted-foreground">
								Build your watchlist, like movies, and get recommendations that match your unique taste.
							</p>
						</div>
						<div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-300 group">
							<div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 mb-4 group-hover:bg-red-500/20 transition-colors">
								<TrendingUp className="h-6 w-6 text-red-500" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-red-500 transition-colors">
								Smart Discovery
							</h3>
							<p className="text-muted-foreground">
								Explore new genres and find hidden gems based on movies you already love.
							</p>
						</div>
						<div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-300 group">
							<div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 mb-4 group-hover:bg-orange-500/20 transition-colors">
								<Zap className="h-6 w-6 text-orange-500" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-orange-500 transition-colors">
								Instant Access
							</h3>
							<p className="text-muted-foreground">
								See where to watch with direct links to popular streaming platforms.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Popular Movies Section */}
			<PopularMoviesSection />

			{/* How It Works Section */}
			<section className="bg-background w-full">
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
							How It Works
						</h2>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
							Get started in three simple steps
						</p>
					</div>
					<div className="grid gap-8 md:grid-cols-3">
						<div className="text-center group">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground group-hover:scale-110 transition-transform duration-300">
								1
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
								Tell Us What You Like
							</h3>
							<p className="text-muted-foreground">
								Browse movies, like the ones that interest you, and add films to your watchlist. Our AI
								learns from your interactions.
							</p>
						</div>
						<div className="text-center group">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground group-hover:scale-110 transition-transform duration-300">
								2
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
								Get Personalized Suggestions
							</h3>
							<p className="text-muted-foreground">
								Our recommendation engine analyzes your preferences alongside movie metadata to find
								films that match your taste.
							</p>
						</div>
						<div className="text-center group">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground group-hover:scale-110 transition-transform duration-300">
								3
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
								Watch and Enjoy
							</h3>
							<p className="text-muted-foreground">
								Browse your personalized recommendations, explore new genres, and watch movies you'll
								love.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Social Proof Section */}
			<section className="bg-background w-full">
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
					<div className="text-center">
						<div className="inline-flex items-center gap-2 text-muted-foreground mb-4">
							<Users className="h-5 w-5" />
							<span className="text-lg">Join thousands of movie lovers</span>
						</div>
						<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
							Stop Wasting Time Searching
						</h2>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
							Spend less time scrolling and more time watching movies you'll actually enjoy. Our AI does
							the heavy lifting for you.
						</p>
						<Link
							href="/discover"
							className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 text-base font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
						>
							<Play className="h-5 w-5" />
							Get Started Free
						</Link>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="bg-gradient-to-br from-accent/10 via-background to-accent-hover/5 w-full">
				<div className="w-full max-w-5xl mx-auto px-4 text-center sm:px-6 lg:px-8 py-20 sm:py-32">
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
						Ready to Discover Your Next Favorite Movie?
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
						Join CineMatch today and start discovering movies tailored to your unique taste. It's free to
						get started.
					</p>
					<Link
						href="/discover"
						className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 text-base font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
					>
						Start Discovering Now
						<ArrowRight className="h-5 w-5" />
					</Link>
				</div>
			</section>

			{/* Sign In Suggestion Section */}
			<SignInSuggestion />
		</div>
	);
}
