import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

interface ActivityRow {
	activity_date: string;
	contribution_count: number;
}

function aggregateContributions(rows: ActivityRow[]) {
	const totals = new Map<string, number>();
	for (const row of rows) {
		const current = totals.get(row.activity_date) ?? 0;
		totals.set(row.activity_date, current + row.contribution_count);
	}

	return Array.from(totals.entries()).map(([date, count]) => ({
		date,
		count,
	}));
}

export async function GET() {
	try {
		const supabase = await createClient();
		const today = new Date();
		const since = new Date();
		since.setDate(today.getDate() - 26 * 7);
		const sinceIso = since.toISOString().split("T")[0];

		const { data, error } = await supabase
			.from("github_activity")
			.select("activity_date, contribution_count")
			.gte("activity_date", sinceIso)
			.order("activity_date", { ascending: true });

		if (error) {
			console.error("Supabase github_activity query failed", error);
			return NextResponse.json(
				{ error: "Failed to load activity" },
				{ status: 500 },
			);
		}

		if (!data || data.length === 0) {
			return NextResponse.json([]);
		}

		return NextResponse.json(aggregateContributions(data));
	} catch (error) {
		console.error("Error fetching git activity from Supabase", error);
		return NextResponse.json(
			{ error: "Failed to fetch git activity" },
			{ status: 500 },
		);
	}
}
