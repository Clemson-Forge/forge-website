import supabase from "@/lib/supabase";

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
];

export class AvatarUploadError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AvatarUploadError";
	}
}

export async function uploadProfileAvatar(file: File) {
	if (file.size > MAX_AVATAR_SIZE_BYTES) {
		throw new AvatarUploadError("Image must be 5MB or smaller");
	}

	if (!ALLOWED_MIME_TYPES.includes(file.type)) {
		throw new AvatarUploadError(
			"Unsupported file type. Use PNG, JPG, WebP, or GIF.",
		);
	}

	const formData = new FormData();
	formData.append("file", file);

	const {
		data: { session },
	} = await supabase.auth.getSession();
	const headers = new Headers();
	if (session?.access_token) {
		headers.set("Authorization", `Bearer ${session.access_token}`);
	}

	const response = await fetch("/api/profile/avatar", {
		method: "POST",
		body: formData,
		headers,
		credentials: "include",
	});

	if (!response.ok) {
		const payload = await response.json().catch(() => null);
		throw new AvatarUploadError(
			payload?.error ?? "Failed to upload image. Please try again.",
		);
	}

	const data = (await response.json().catch(() => null)) as {
		avatarUrl?: string;
	} | null;
	if (!data?.avatarUrl) {
		throw new AvatarUploadError(
			"Upload completed but no image URL was returned.",
		);
	}

	return data.avatarUrl;
}
