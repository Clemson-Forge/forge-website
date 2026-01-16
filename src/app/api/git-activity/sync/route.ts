import { syncGithubActivity } from "@/lib/github-activity-sync";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYNC_SECRET = process.env.GITHUB_ACTIVITY_SYNC_SECRET;

export async function POST(req: NextRequest) {
	if (!SYNC_SECRET) {
		return NextResponse.json(
			{ error: "Server missing GITHUB_ACTIVITY_SYNC_SECRET" },
			{ status: 500 },
		);
	}

	const authHeader = req.headers.get("authorization");
	if (authHeader !== `Bearer ${SYNC_SECRET}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const result = await syncGithubActivity();
		return NextResponse.json(result);
	} catch (error) {
		console.error("GitHub activity sync failed", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Sync failed" },
			{ status: 500 },
		);
	}
}
