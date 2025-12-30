import { members } from "@/models/members";
import { NextResponse } from "next/server";

interface Contribution {
	date: string;
	count: number;
}

interface GitActivity {
	username: string;
	data: {
		contributions: Array<{
			date: string;
			count: number;
		}>;
	};
}

export async function GET() {
	try {
		const gitActivities = await Promise.all(
			members.map(async (member) => {
				const memberResponse = await fetch(
					`https://github-contributions-api.jogruber.de/v4/${member.githubUsername}`,
				);
				const memberData = await memberResponse.json();
				return {
					username: member.githubUsername,
					data: memberData,
				};
			}),
		);

		const combinedActivities: Contribution[] = gitActivities.flatMap(
			(activity: GitActivity) => {
				const contributions = activity?.data?.contributions ?? [];
				return contributions
					.filter((contribution) => contribution.count > 0)
					.map((contribution): Contribution => {
						const date = new Date(contribution.date);
						date.setDate(date.getDate() + 1);
						const newDateStr = date.toISOString().split("T")[0];

						return {
							date: newDateStr,
							count: contribution.count,
						};
					});
			},
		);

		combinedActivities.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		);

		return NextResponse.json(combinedActivities);
	} catch (error) {
		console.error("Error fetching git activity:", error);
		return NextResponse.json(
			{ error: "Failed to fetch git activity" },
			{ status: 500 },
		);
	}
}
