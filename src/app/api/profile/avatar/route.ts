import { createClient } from "@/lib/supabase-server";
import { createServiceRoleClient } from "@/lib/supabase-admin";
import { Buffer } from "node:buffer";
import { NextRequest, NextResponse } from "next/server";

const PROFILE_PHOTOS_BUCKET = "profile-photos";
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
];

function inferExtension(file: File) {
	const name = file.name?.split(".")?.pop()?.toLowerCase();
	if (name && /^[a-z0-9]+$/i.test(name)) {
		return name;
	}
	if (file.type === "image/jpeg") return "jpg";
	if (file.type === "image/png") return "png";
	if (file.type === "image/webp") return "webp";
	if (file.type === "image/gif") return "gif";
	return "bin";
}

async function getAuthedUser(req: NextRequest) {
	const supabase = await createClient();
	const authHeader = req.headers.get("authorization");
	if (authHeader?.startsWith("Bearer ")) {
		const token = authHeader.slice(7);
		const {
			data: { user },
		} = await supabase.auth.getUser(token);
		if (user) {
			return { supabase, user };
		}
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return { supabase, user };
}

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	const { user } = await getAuthedUser(req);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const formData = await req.formData();
	const file = formData.get("file");

	if (!(file instanceof File)) {
		return NextResponse.json({ error: "Missing file" }, { status: 400 });
	}

	if (file.size === 0) {
		return NextResponse.json(
			{ error: "Uploaded file is empty" },
			{ status: 400 },
		);
	}

	if (file.size > MAX_AVATAR_SIZE_BYTES) {
		return NextResponse.json(
			{ error: "Image must be 5MB or smaller" },
			{ status: 400 },
		);
	}

	if (!ALLOWED_MIME_TYPES.includes(file.type)) {
		return NextResponse.json(
			{ error: "Unsupported file type" },
			{ status: 400 },
		);
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const extension = inferExtension(file);
	const path = `avatars/${user.id}-${Date.now()}.${extension}`;

	const supabaseAdmin = createServiceRoleClient();
	const { error } = await supabaseAdmin.storage
		.from(PROFILE_PHOTOS_BUCKET)
		.upload(path, buffer, {
			cacheControl: "3600",
			upsert: true,
			contentType: file.type,
		});

	if (error) {
		console.error("Supabase avatar upload failed", error);
		return NextResponse.json(
			{ error: "Failed to upload image" },
			{ status: 500 },
		);
	}

	const {
		data: { publicUrl },
	} = supabaseAdmin.storage.from(PROFILE_PHOTOS_BUCKET).getPublicUrl(path);

	if (!publicUrl) {
		return NextResponse.json(
			{ error: "Unable to retrieve uploaded image URL" },
			{ status: 500 },
		);
	}

	return NextResponse.json({ avatarUrl: publicUrl });
}
