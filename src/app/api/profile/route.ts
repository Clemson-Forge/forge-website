import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

const PROFILE_FIELDS =
	"display_name, role, headline, grad_year, github_url, github_username, linkedin_url, avatar_url, last_activity_sync, updated_at";

type Role = "executive" | "mentor" | "member";

function sanitizeRole(role?: string | null): Role {
	const fallback: Role = "member";
	if (!role) return fallback;
	return ["executive", "mentor", "member"].includes(role)
		? (role as Role)
		: fallback;
}

function normalizeLinkedInUrl(url?: string | null) {
	if (!url) return null;
	const trimmed = url.trim();
	const value = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
	const parsed = new URL(value);
	if (!parsed.hostname.includes("linkedin.com")) {
		throw new Error("LinkedIn URL must point to linkedin.com");
	}
	return parsed.toString();
}

function normalizeGithubUrl(url?: string | null) {
	if (!url) return null;
	const trimmed = url.trim();
	if (!trimmed) return null;
	if (trimmed.startsWith("http")) {
		return trimmed;
	}
	return `https://github.com/${trimmed.replace(/^@/, "")}`;
}

function extractGithubUsername(url?: string | null) {
	if (!url) return null;
	let username = url.trim();
	if (!username) return null;
	if (username.startsWith("http")) {
		try {
			const parsed = new URL(username);
			username = parsed.pathname.replace(/\/$/, "").replace(/^\//, "");
		} catch {
			return null;
		}
	}
	const cleaned = username.replace(/^@/, "");
	return cleaned || null;
}

function normalizeAvatarUrl(url?: string | null) {
	if (!url) return null;
	const trimmed = url.toString().trim();
	if (!trimmed) return null;
	try {
		const parsed = new URL(trimmed);
		return parsed.toString();
	} catch {
		throw new Error("Avatar URL must be a valid URL");
	}
}

function serializeProfileResponse(
	user: {
		id: string;
		email?: string | null;
		full_name?: string | null;
	},
	profile?: {
		display_name?: string | null;
		role?: Role | null;
		headline?: string | null;
		grad_year?: string | null;
		github_url?: string | null;
		github_username?: string | null;
		linkedin_url?: string | null;
		avatar_url?: string | null;
		last_activity_sync?: string | null;
		updated_at?: string | null;
	},
) {
	return {
		email: user.email ?? null,
		id: user.id,
		displayName:
			profile?.display_name ?? user.full_name ?? user.email ?? "",
		role: profile?.role ?? "member",
		headline: profile?.headline ?? "",
		gradYear: profile?.grad_year ?? "",
		githubUrl: profile?.github_url ?? "",
		githubUsername: profile?.github_username ?? "",
		linkedinUrl: profile?.linkedin_url ?? "",
		avatarUrl: profile?.avatar_url ?? null,
		lastActivitySync: profile?.last_activity_sync ?? null,
		updatedAt: profile?.updated_at ?? null,
	};
}

async function getAuthedUser(req: NextRequest) {
	const supabase = await createClient();
	const authHeader = req.headers.get("authorization");
	if (authHeader?.startsWith("Bearer ")) {
		const token = authHeader.slice(7);
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);

		if (!error && user) {
			return { supabase, user };
		}
	}

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		return { supabase, user: null, error };
	}

	return { supabase, user };
}

export async function GET(req: NextRequest) {
	const { supabase, user } = await getAuthedUser(req);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { data, error } = await supabase
		.from("profiles")
		.select(PROFILE_FIELDS)
		.eq("id", user.id)
		.maybeSingle();

	if (error && error.code !== "PGRST116") {
		console.error("Failed to load profile", error);
		return NextResponse.json({ error: "Failed to load" }, { status: 500 });
	}

	return NextResponse.json(
		serializeProfileResponse(
			{
				id: user.id,
				email: user.email,
				full_name: user.user_metadata?.full_name,
			},
			data ?? undefined,
		),
	);
}

export async function PATCH(req: NextRequest) {
	try {
		const body = await req.json();
		const displayName: string | undefined = body.displayName?.trim();
		const role = sanitizeRole(body.role);
		const headline = body.headline?.toString().trim() || null;
		const gradYear = body.gradYear?.toString().trim() || null;

		let linkedinUrl: string | null = null;
		try {
			linkedinUrl = normalizeLinkedInUrl(body.linkedinUrl);
		} catch (error) {
			return NextResponse.json(
				{
					error:
						error instanceof Error
							? error.message
							: "Invalid LinkedIn URL",
				},
				{ status: 400 },
			);
		}

		const githubUrl = normalizeGithubUrl(body.githubUrl);
		const githubUsername = extractGithubUsername(githubUrl);

		let avatarUrl: string | null = null;
		try {
			avatarUrl = normalizeAvatarUrl(body.avatarUrl);
		} catch (error) {
			return NextResponse.json(
				{
					error:
						error instanceof Error
							? error.message
							: "Invalid avatar URL",
				},
				{ status: 400 },
			);
		}

		if (!displayName) {
			return NextResponse.json(
				{ error: "Display name is required" },
				{ status: 400 },
			);
		}
		if (!linkedinUrl) {
			return NextResponse.json(
				{ error: "LinkedIn URL is required" },
				{ status: 400 },
			);
		}

		const { supabase, user } = await getAuthedUser(req);
		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const payload = {
			id: user.id,
			display_name: displayName,
			role,
			headline,
			grad_year: gradYear,
			linkedin_url: linkedinUrl,
			github_url: githubUrl,
			github_username: githubUsername,
			avatar_url: avatarUrl,
			updated_at: new Date().toISOString(),
		};

		const { error } = await supabase.from("profiles").upsert(payload);
		if (error) {
			console.error("Supabase upsert error:", error);
			return NextResponse.json(
				{ error: "Failed to save" },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			serializeProfileResponse(
				{
					id: user.id,
					email: user.email,
					full_name: user.user_metadata?.full_name,
				},
				{
					display_name: payload.display_name,
					role: payload.role,
					headline: payload.headline ?? undefined,
					grad_year: payload.grad_year ?? undefined,
					linkedin_url: payload.linkedin_url,
					github_url: payload.github_url ?? undefined,
					github_username: payload.github_username ?? undefined,
					avatar_url: payload.avatar_url ?? undefined,
					updated_at: payload.updated_at,
				},
			),
		);
	} catch (error) {
		console.error("Profile PATCH failed", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Server Error" },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	return PATCH(req);
}
