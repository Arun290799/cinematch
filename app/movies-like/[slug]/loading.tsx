export default function Loading() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Header Skeleton */}
			<header className="border-b border-border bg-card/50 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
					<div className="h-6 w-24 animate-pulse rounded bg-muted" />
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
				{/* Hero Section Skeleton */}
				<div className="mb-12">
					<div className="mb-6 h-12 w-3/4 animate-pulse rounded-lg bg-muted sm:h-16 lg:h-20" />
					<div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
						{/* Base Movie Poster Skeleton */}
						<div className="shrink-0">
							<div className="aspect-2/3 w-48 animate-pulse rounded-xl bg-muted lg:w-64" />
						</div>

						{/* Base Movie Info Skeleton */}
						<div className="flex-1 space-y-4">
							<div className="h-8 w-1/2 animate-pulse rounded-lg bg-muted" />
							<div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
							<div className="space-y-2">
								<div className="h-4 w-full animate-pulse rounded bg-muted" />
								<div className="h-4 w-full animate-pulse rounded bg-muted" />
								<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
							</div>
							<div className="h-32 w-full animate-pulse rounded-xl bg-muted" />
						</div>
					</div>
				</div>

				{/* Similar Movies Section Skeleton */}
				<div className="mt-12">
					<div className="mb-8 h-10 w-1/3 animate-pulse rounded-lg bg-muted" />
					<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{Array.from({ length: 10 }).map((_, i) => (
							<div key={i} className="flex flex-col gap-2">
								<div className="aspect-2/3 w-full animate-pulse rounded-xl bg-muted" />
								<div className="space-y-2 p-2">
									<div className="h-4 w-full animate-pulse rounded bg-muted" />
									<div className="h-3 w-full animate-pulse rounded bg-muted" />
									<div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
								</div>
							</div>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
