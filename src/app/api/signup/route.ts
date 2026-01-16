import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const supabase = await createClient();
		const { githubUrl, linkedinUrl } = await req.json();

		if (!githubUrl || !linkedinUrl) {
			return NextResponse.json(
				{ error: "Missing fields" },
				{ status: 400 },
			);
		}

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();
		if (userError || !user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const { error } = await supabase.from("signups").insert({
			id: user.id,
			github_url: githubUrl,
			linkedin_url: linkedinUrl,
		});

		if (error) {
			console.error("Supabase insert error:", error);
		}

		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ error: "Bad request" }, { status: 400 });
	}
}
