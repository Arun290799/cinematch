import { ReactNode } from "react";

interface LegalLayoutProps {
	children: ReactNode;
	title?: string;
	description?: string;
	updatedAt?: string;
}

export default function LegalLayout({ children, title, description, updatedAt }: LegalLayoutProps) {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			{title && (
				<div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-accent/5 via-background to-accent-hover/5">
					<div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
						<div className="text-center">
							<h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
								{title}
							</h1>
							{description && (
								<p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
									{description}
								</p>
							)}
							{updatedAt && (
								<div className="mt-8 flex items-center justify-center gap-2">
									<span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
										Last updated: {updatedAt}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Main Content */}
			<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
				<div className="space-y-8">
					{children}
				</div>
			</div>
		</div>
	);
}
