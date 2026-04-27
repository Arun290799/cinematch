import LegalLayout from "@/components/LegalLayout";

export const metadata = {
	title: "About | CineMatch",
	description:
		"Learn about CineMatch - your AI-powered movie recommendation platform that helps you discover films you'll love.",
};

export default function About() {
	return (
		<LegalLayout
			title="About CineMatch"
			description="Your AI-powered movie recommendation platform that helps you discover films you'll love."
		>
			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">What is CineMatch?</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					CineMatch is a modern movie recommendation platform designed to help you discover films tailored to
					your tastes. We combine artificial intelligence with your personal preferences to suggest movies
					you'll actually enjoy watching.
				</p>
				<p className="text-muted-foreground leading-relaxed">
					Whether you're a casual viewer looking for something to watch on Friday night or a film enthusiast
					exploring new genres, CineMatch makes movie discovery simple, personalized, and enjoyable.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">The Problem We Solve</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					With thousands of movies available across streaming platforms, finding something to watch can be
					overwhelming. Traditional recommendation systems often suggest the same popular titles or rely on
					generic categories that don't reflect your unique taste.
				</p>
				<p className="text-muted-foreground leading-relaxed">
					CineMatch solves this by learning from your actual preferences—the movies you like, the ones you add
					to your watchlist, and the genres you gravitate toward—to provide recommendations that feel personal
					and relevant.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">How It Works</h2>
				<div className="space-y-4">
					<div className="flex gap-4">
						<div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
							1
						</div>
						<div>
							<h3 className="text-lg font-medium text-foreground mb-2">Tell Us What You Like</h3>
							<p className="text-muted-foreground leading-relaxed">
								As you browse movies, simply like the ones that interest you and add films to your
								watchlist. These interactions help our algorithm understand your preferences.
							</p>
						</div>
					</div>
					<div className="flex gap-4">
						<div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
							2
						</div>
						<div>
							<h3 className="text-lg font-medium text-foreground mb-2">AI-Powered Recommendations</h3>
							<p className="text-muted-foreground leading-relaxed">
								Our recommendation engine analyzes your preferences alongside movie metadata—including
								genres, ratings, themes, and more—to find films that match your taste profile.
							</p>
						</div>
					</div>
					<div className="flex gap-4">
						<div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
							3
						</div>
						<div>
							<h3 className="text-lg font-medium text-foreground mb-2">Discover and Enjoy</h3>
							<p className="text-muted-foreground leading-relaxed">
								Browse your personalized recommendations, explore new genres, and build your watchlist.
								We'll continuously refine our suggestions as your preferences evolve.
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Our Technology</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					CineMatch leverages modern technologies to deliver a seamless experience:
				</p>
				<ul className="space-y-2 text-muted-foreground">
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Machine Learning:</strong> Our algorithms learn from your interactions to improve
							recommendations over time
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>TMDB Integration:</strong> We use The Movie Database API to access comprehensive
							movie information
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Modern Web Stack:</strong> Built with Next.js 14 for fast, responsive performance
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Privacy-First:</strong> Your data is used solely to improve your recommendations—we
							don't sell your information
						</span>
					</li>
				</ul>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Our Vision</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					We believe everyone deserves a personalized entertainment experience. Our vision is to make movie
					discovery effortless and enjoyable, helping you spend less time searching and more time watching
					films you love.
				</p>
				<p className="text-muted-foreground leading-relaxed">
					We're continuously improving our algorithms, expanding our movie database, and adding features to
					enhance your experience. Your feedback helps us grow.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Our Values</h2>
				<div className="grid sm:grid-cols-2 gap-4">
					<div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
						<h3 className="font-semibold text-foreground mb-2">Personalization</h3>
						<p className="text-sm text-muted-foreground">
							Every recommendation should feel like it was handpicked for you
						</p>
					</div>
					<div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
						<h3 className="font-semibold text-foreground mb-2">Simplicity</h3>
						<p className="text-sm text-muted-foreground">
							Great technology should be intuitive and easy to use
						</p>
					</div>
					<div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
						<h3 className="font-semibold text-foreground mb-2">Privacy</h3>
						<p className="text-sm text-muted-foreground">
							Your data belongs to you—we protect it and use it responsibly
						</p>
					</div>
					<div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
						<h3 className="font-semibold text-foreground mb-2">Quality</h3>
						<p className="text-sm text-muted-foreground">
							We prioritize accuracy and relevance in our recommendations
						</p>
					</div>
					<div className="p-4 rounded-lg bg-accent/5 border border-accent/10 sm:col-span-2">
						<h3 className="font-semibold text-foreground mb-2">Community</h3>
						<p className="text-sm text-muted-foreground">
							We're building a platform that evolves with our users' needs
						</p>
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Get in Touch</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					Have questions, feedback, or suggestions? We'd love to hear from you.
				</p>
				<ul className="space-y-2 text-muted-foreground">
					<li className="flex items-center gap-2">
						<span className="text-accent">•</span>
						<span>
							<strong>Contact Form:</strong>{" "}
							<a href="/contact" className="text-accent hover:underline">
								Visit our contact page
							</a>
						</span>
					</li>
				</ul>
				<p className="text-muted-foreground mt-6 text-center">
					Thank you for being part of the CineMatch community. Happy watching!
				</p>
			</div>
		</LegalLayout>
	);
}
