import CompanyTicker from "@/components/company-ticker";
import GitActivity from "@/components/git-activity-chart";
import Link from "next/link";
import React from "react";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-between p-8 mt-16">
			<div className="w-full max-w-3xl text-center mt-4 space-y-6">
				<div>
					<h1 className="text-4xl font-bold mb-4">Clemson Forge</h1>
					<p className="text-xl">
						Clemson Forge is a student-run, project-based
						organization at Clemson University geared towards
						computer science students.
					</p>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Link
						href="/apply"
						className="rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5"
					>
						Apply to Forge
					</Link>
					<Link
						href="/members"
						className="rounded-full border px-6 py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5"
					>
						See the community
					</Link>
					<Link
						href="/signin"
						className="rounded-full border px-6 py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5"
					>
						Member hub
					</Link>
				</div>
			</div>

			<div className="w-full max-w-xl text-center mt-8">
				<h2 className="text-2xl font-semibold mb-6">
					Our Mentors Have Worked At
				</h2>
				<CompanyTicker />
			</div>

			<div className="w-full max-w-3xl p-6 mb-auto mt-4">
				<h2 className="text-2xl font-semibold mb-4 text-center">
					Organization GitHub Activity
				</h2>

				<React.Suspense
					fallback={
						<div className="text-center py-8 flex items-center justify-center">
							<span className="ml-3">
								Loading activity data...
							</span>
						</div>
					}
				>
					<GitActivity />
				</React.Suspense>
			</div>
		</div>
	);
}
