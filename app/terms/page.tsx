import LegalLayout from "@/components/LegalLayout";

export const metadata = {
	title: "Terms of Service | CineMatch",
	description:
		"Terms of Service for CineMatch. Read our terms governing your use of our movie recommendation platform.",
};

export default function TermsOfService() {
	return (
		<LegalLayout
			title="Terms of Service"
			description="Please read these terms carefully before using CineMatch's movie recommendation platform."
			updatedAt={new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
		>
			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					By accessing or using CineMatch ("the Service"), you agree to be bound by these Terms of Service
					("Terms"). If you disagree with any part of these terms, you may not access the Service.
				</p>
				<p className="text-muted-foreground leading-relaxed">
					These Terms constitute a legally binding agreement between you and CineMatch. Please read them
					carefully.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Use of Service</h2>

				<h3 className="text-lg font-medium text-foreground mb-3">Eligibility</h3>
				<p className="text-muted-foreground leading-relaxed mb-6">
					You must be at least 13 years old to use this Service. By using this Service, you represent and
					warrant that you are at least 13 years old.
				</p>

				<h3 className="text-lg font-medium text-foreground mb-3">Permitted Use</h3>
				<p className="text-muted-foreground leading-relaxed mb-4">
					You may use the Service for personal, non-commercial purposes, including:
				</p>
				<ul className="space-y-2 text-muted-foreground mb-6">
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>Discovering and exploring movie recommendations</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>Creating and managing your watchlist</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>Liking and rating movies</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>Accessing movie information provided through our platform</span>
					</li>
				</ul>

				<h3 className="text-lg font-medium text-foreground mb-3">Prohibited Use</h3>
				<p className="text-muted-foreground leading-relaxed mb-4">You may not:</p>
				<ul className="space-y-2 text-muted-foreground">
					<li className="flex items-start gap-2">
						<span className="text-destructive mt-1">•</span>
						<span>Use the Service for any illegal or unauthorized purpose</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-destructive mt-1">•</span>
						<span>Reverse engineer, decompile, or attempt to extract source code from the Service</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-destructive mt-1">•</span>
						<span>Use automated systems to access the Service without permission</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-destructive mt-1">•</span>
						<span>Interfere with or disrupt the Service or servers connected to the Service</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-destructive mt-1">•</span>
						<span>Reproduce, duplicate, copy, sell, or exploit any portion of the Service</span>
					</li>
				</ul>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimer</h2>
				<div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
					<p className="text-destructive font-semibold mb-2">Important:</p>
					<p className="text-muted-foreground leading-relaxed">
						Movie recommendations provided by CineMatch are for informational purposes only. Our
						recommendations are generated based on algorithms and user preferences, and do not guarantee
						satisfaction or quality.
					</p>
				</div>
				<p className="text-muted-foreground leading-relaxed mb-4">
					We do not endorse, guarantee, or make any representations about the accuracy, reliability, or
					quality of any movie, service, or content mentioned on our platform.
				</p>
				<p className="text-muted-foreground leading-relaxed">
					Your decision to watch any movie is solely your own responsibility.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					To the fullest extent permitted by law, CineMatch shall not be liable for:
				</p>
				<ul className="space-y-2 text-muted-foreground mb-4">
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>Any indirect, incidental, special, or consequential damages</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>Loss of data, profits, or business opportunities</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>Any damages arising from your use or inability to use the Service</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-accent mt-1">•</span>
						<span>Any errors, inaccuracies, or omissions in movie information</span>
					</li>
				</ul>
				<p className="text-muted-foreground leading-relaxed text-sm">
					Our total liability to you for all claims shall not exceed the amount you paid, if any, to use the
					Service.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
				<p className="text-muted-foreground leading-relaxed mb-4">
					If you have questions about these Terms of Service, please contact us:
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
