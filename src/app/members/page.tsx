import { createClient } from "@/lib/supabase-server";
export const revalidate = 300;

type PublicProfile = {
	id: string;
	display_name: string | null;
	role: "executive" | "mentor" | "member" | null;
	headline: string | null;
	grad_year: string | null;
	avatar_url: string | null;
	github_username: string | null;
	github_url: string | null;
	linkedin_url: string | null;
};

const sections: {
	key: "executive" | "mentor" | "member";
	title: string;
	description: string;
}[] = [
	{
		key: "executive",
		title: "Our Executive Team",
		description:
			"Student leaders coordinating programs, partnerships, and new initiatives.",
	},
	{
		key: "mentor",
		title: "Mentor Network",
		description: "Industry mentors and alumni who coach current members.",
	},
	{
		key: "member",
		title: "Active Members",
		description: "Builders working on semester projects, events, and labs.",
	},
];

function LinkedInIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
		</svg>
	);
}

function GitHubIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
		</svg>
	);
}

function MemberCard({ profile }: { profile: PublicProfile }) {
	const avatarSrc = profile.avatar_url;

	return (
		<div className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-transform duration-300 hover:scale-[1.01]">
			<div className="relative h-48 w-full bg-muted">
				{avatarSrc ? (
					<img
						src={avatarSrc}
						alt={`${profile.display_name ?? "Member"} avatar`}
						className="h-full w-full object-cover"
						loading="lazy"
					/>
				) : (
					<div className="flex h-full items-center justify-center text-2xl font-semibold text-muted-foreground">
						{profile.display_name?.charAt(0) ?? "?"}
					</div>
				)}
			</div>
			<div className="flex flex-1 flex-col gap-2 p-4">
				<div>
					<h3 className="text-lg font-semibold">
						{profile.display_name ?? "Club Member"}
					</h3>
					{profile.grad_year && (
						<p className="text-sm text-muted-foreground">
							Class of {profile.grad_year}
						</p>
					)}
				</div>
				{profile.headline && (
					<p className="text-sm text-muted-foreground">
						{profile.headline}
					</p>
				)}
				<div className="mt-auto flex items-center gap-3 pt-2">
					{profile.linkedin_url ? (
						<a
							href={profile.linkedin_url}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
						>
							<LinkedInIcon />
							LinkedIn
						</a>
					) : (
						<span className="text-xs text-muted-foreground">
							LinkedIn pending
						</span>
					)}
					{profile.github_url ? (
						<a
							href={profile.github_url}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
						>
							<GitHubIcon />
							GitHub
						</a>
					) : (
						<span className="text-xs text-muted-foreground">
							GitHub optional
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

export default async function MembersPage() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("public_profiles")
		.select(
			"id, display_name, role, headline, grad_year, avatar_url, github_username, github_url, linkedin_url",
		)
		.order("display_name", { ascending: true });

	if (error) {
		console.error("Failed to load member directory", error);
		return (
			<div className="flex min-h-screen items-center justify-center p-8">
				<p className="text-muted-foreground">
					We couldn&apos;t load the directory. Please try again later.
				</p>
			</div>
		);
	}

	const grouped = sections.map((section) => ({
		...section,
		members: data?.filter((profile) => profile.role === section.key) ?? [],
	}));

	return (
		<div className="mt-16 flex min-h-screen flex-col items-center p-8">
			<div className="w-full max-w-6xl space-y-16">
				{grouped.map((section) => (
					<section key={section.key}>
						<div className="text-center">
							<h2 className="text-3xl font-bold">
								{section.title}
							</h2>
							<p className="mt-2 text-base text-muted-foreground">
								{section.description}
							</p>
						</div>
						{section.members.length === 0 ? (
							<p className="mt-6 text-center text-sm text-muted-foreground">
								No profiles in this group yet.
							</p>
						) : (
							<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
								{section.members.map((profile) => (
									<MemberCard
										key={profile.id}
										profile={profile}
									/>
								))}
							</div>
						)}
					</section>
				))}
			</div>
		</div>
	);
}
