import { createServiceRoleClient } from "@/lib/supabase-admin";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const CONTRIBUTION_QUERY = `
	query($login: String!, $from: DateTime!, $to: DateTime!) {
		user(login: $login) {
			contributionsCollection(from: $from, to: $to) {
				contributionCalendar {
					weeks {
						contributionDays {
							date
							contributionCount
						}
					}
				}
			}
		}
	}
`;

type ContributionDay = {
	date: string;
	contributionCount: number;
};

type ProfileRow = {
	id: string;
	github_username: string | null;
};

type SyncResult = {
	syncedProfiles: number;
	rowsUpserted: number;
	failures: { id: string; username: string; reason: string }[];
};

function chunkArray<T>(items: T[], size: number) {
	const chunks: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size));
	}
	return chunks;
}

async function fetchGithubContributions(
	login: string,
	from: string,
	to: string,
) {
	if (!GITHUB_TOKEN) {
		throw new Error("GITHUB_TOKEN is not configured");
	}

	const response = await fetch("https://api.github.com/graphql", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: CONTRIBUTION_QUERY,
			variables: { login, from, to },
		}),
	});

	const payload = await response.json();
	if (!response.ok || payload.errors) {
		const reason = payload.errors?.[0]?.message ?? response.statusText;
		throw new Error(reason || "GitHub GraphQL request failed");
	}

	const weeks: { contributionDays: ContributionDay[] }[] =
		payload.data?.user?.contributionsCollection?.contributionCalendar
			?.weeks ?? [];

	return weeks
		.flatMap((week) => week.contributionDays ?? [])
		.filter((day) => day.contributionCount > 0)
		.map((day) => ({
			date: day.date,
			count: day.contributionCount,
		}));
}

export async function syncGithubActivity(): Promise<SyncResult> {
	if (!GITHUB_TOKEN) {
		throw new Error("GITHUB_TOKEN is not configured");
	}

	const supabase = createServiceRoleClient();
	const { data: profiles, error } = await supabase
		.from("profiles")
		.select("id, github_username")
		.not("github_username", "is", null);

	if (error) {
		throw new Error("Failed to load profiles for sync");
	}

	if (!profiles || profiles.length === 0) {
		return { syncedProfiles: 0, rowsUpserted: 0, failures: [] };
	}

	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(endDate.getDate() - 26 * 7);
	const startIso = startDate.toISOString();
	const endIso = endDate.toISOString();

	const rows: {
		member_id: string;
		activity_date: string;
		contribution_count: number;
	}[] = [];
	const syncedIds: string[] = [];
	const failures: { id: string; username: string; reason: string }[] = [];

	for (const profile of profiles as ProfileRow[]) {
		const username = profile.github_username?.trim();
		if (!username) continue;

		try {
			const contributions = await fetchGithubContributions(
				username,
				startIso,
				endIso,
			);
			rows.push(
				...contributions.map((day) => ({
					member_id: profile.id,
					activity_date: day.date,
					contribution_count: day.count,
				})),
			);
			syncedIds.push(profile.id);
		} catch (err) {
			const reason = err instanceof Error ? err.message : "Unknown error";
			failures.push({ id: profile.id, username, reason });
		}
	}

	if (rows.length) {
		for (const chunk of chunkArray(rows, 500)) {
			const { error: upsertError } = await supabase
				.from("github_activity")
				.upsert(chunk, { onConflict: "member_id,activity_date" });
			if (upsertError) {
				throw new Error("Failed to persist GitHub activity rows");
			}
		}
	}

	if (syncedIds.length) {
		const { error: updateError } = await supabase
			.from("profiles")
			.update({ last_activity_sync: endIso })
			.in("id", syncedIds);
		if (updateError) {
			console.error("Failed to update last_activity_sync", updateError);
		}
	}

	return {
		syncedProfiles: syncedIds.length,
		rowsUpserted: rows.length,
		failures,
	};
}
