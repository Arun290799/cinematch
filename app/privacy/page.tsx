import LegalLayout from "@/components/LegalLayout";

export const metadata = {
	title: "Privacy Policy | CineMatch",
	description:
		"Learn how CineMatch collects, uses, and protects your personal information. Your privacy matters to us.",
};

export default function PrivacyPolicy() {
	return (
		<LegalLayout
			title="Privacy Policy"
			description="Your privacy is important to us. Learn how we collect, use, and protect your information."
			updatedAt={new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
		>
			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					CineMatch ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
					explains how we collect, use, disclose, and safeguard your information when you use our movie
					recommendation platform.
				</p>
				<p className="text-muted-foreground leading-relaxed">
					By using CineMatch, you agree to the collection and use of information in accordance with this
					policy.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					We collect several types of information to provide and improve our services:
				</p>

				<h3 className="text-lg font-medium text-foreground mb-3">Personal Information</h3>
				<ul className="space-y-2 text-muted-foreground mb-6">
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Email address:</strong> When you create an account
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Name:</strong> Optional, provided during account creation
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Authentication data:</strong> Secure login credentials (stored encrypted)
						</span>
					</li>
				</ul>

				<h3 className="text-lg font-medium text-foreground mb-3">Usage Information</h3>
				<ul className="space-y-2 text-muted-foreground mb-6">
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Movie preferences:</strong> Movies you like, add to watchlist, or interact with
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Recommendation history:</strong> Movies recommended to you and your engagement
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Search queries:</strong> Terms you search for on our platform
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Device information:</strong> Browser type, operating system, and device identifiers
						</span>
					</li>
				</ul>

				<h3 className="text-lg font-medium text-foreground mb-3">Third-Party Data</h3>
				<p className="text-muted-foreground leading-relaxed">
					We use <strong>The Movie Database (TMDB) API</strong> to fetch movie information including titles,
					descriptions, posters, ratings, and metadata. We do not store this data permanently—it is fetched
					on-demand and cached temporarily for performance.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					We use your information for the following purposes:
				</p>
				<ul className="space-y-2 text-muted-foreground">
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Personalized recommendations:</strong> To provide movie suggestions based on your
							preferences
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Account management:</strong> To authenticate and manage your account
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Service improvement:</strong> To analyze usage patterns and improve our
							recommendation algorithm
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Communication:</strong> To send important updates about your account (with your
							consent)
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Security:</strong> To detect, prevent, and address technical issues and fraudulent
							activity
						</span>
					</li>
				</ul>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					We implement appropriate security measures to protect your information:
				</p>
				<ul className="space-y-2 text-muted-foreground mb-4">
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Encryption:</strong> Data is encrypted in transit and at rest where applicable
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Access controls:</strong> Limited access to personal data on a need-to-know basis
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>
							<strong>Regular audits:</strong> Periodic security reviews to identify and address
							vulnerabilities
						</span>
					</li>
				</ul>
				<p className="text-muted-foreground leading-relaxed text-sm">
					However, no method of transmission over the internet is 100% secure. While we strive to protect your
					data, we cannot guarantee absolute security.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					If you have questions about this Privacy Policy or your personal data, please contact us:
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
			</div>
		</LegalLayout>
	);
}
