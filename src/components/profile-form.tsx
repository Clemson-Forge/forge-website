"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import supabase from "@/lib/supabase";
import { AvatarUploadError, uploadProfileAvatar } from "@/lib/upload-avatar";

const profileSchema = z.object({
	displayName: z
		.string()
		.min(2, "Display name is required")
		.max(80, "Display name is too long"),
	role: z.enum(["executive", "mentor", "member"]),
	headline: z
		.string()
		.max(140, "Headline must be 140 characters or fewer")
		.optional()
		.or(z.literal("")),
	gradYear: z
		.string()
		.optional()
		.refine((val) => !val || /^\d{4}$/.test(val), {
			message: "Use a four-digit year",
		}),
	linkedinUrl: z
		.string()
		.url("Enter a valid URL")
		.refine((val) => val.includes("linkedin.com"), {
			message: "Must be a LinkedIn profile URL",
		}),
	githubUrl: z
		.union([z.literal(""), z.string().url("Enter a valid URL")])
		.optional()
		.refine((val) => !val || val === "" || val.includes("github.com"), {
			message: "Must be a GitHub profile URL",
		}),
	avatarUrl: z
		.union([z.literal(""), z.string().url("Avatar URL must be valid")])
		.optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type ProfileResponse = {
	id: string;
	email: string | null;
	displayName: string;
	role: "executive" | "mentor" | "member";
	headline: string;
	gradYear: string;
	githubUrl: string;
	linkedinUrl: string;
	githubUsername?: string;
	avatarUrl?: string | null;
	lastActivitySync?: string | null;
};

export interface ProfileFormProps {
	showPreview?: boolean;
	onSuccess?: (data: ProfileResponse) => void;
}

export function ProfileForm({
	showPreview = false,
	onSuccess,
}: ProfileFormProps) {
	const [initializing, setInitializing] = useState(true);
	const [status, setStatus] = useState<
		"idle" | "submitting" | "success" | "error"
	>("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [uploadingAvatar, setUploadingAvatar] = useState(false);
	const [avatarError, setAvatarError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	async function authorizedFetch(
		input: RequestInfo | URL,
		init?: RequestInit,
	) {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		const headers = new Headers(init?.headers);
		if (session?.access_token) {
			headers.set("Authorization", `Bearer ${session.access_token}`);
		}
		return fetch(input, {
			...init,
			headers,
			credentials: "include",
		});
	}

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			displayName: "",
			role: "member",
			headline: "",
			gradYear: "",
			linkedinUrl: "",
			githubUrl: "",
			avatarUrl: "",
		},
	});

	useEffect(() => {
		let active = true;

		async function loadProfile() {
			try {
				const response = await authorizedFetch("/api/profile");
				if (!response.ok) {
					throw new Error("Unable to load profile");
				}
				const data: ProfileResponse = await response.json();
				if (!active) return;

				form.reset({
					displayName: data.displayName ?? "",
					role: data.role ?? "member",
					headline: data.headline ?? "",
					gradYear: data.gradYear ?? "",
					linkedinUrl: data.linkedinUrl ?? "",
					githubUrl: data.githubUrl ?? "",
					avatarUrl: data.avatarUrl ?? "",
				});
				setErrorMessage(null);
			} catch (error) {
				console.error(error);
				if (!active) return;
				setErrorMessage(
					error instanceof Error
						? error.message
						: "Failed to load profile",
				);
			} finally {
				if (active) setInitializing(false);
			}
		}

		loadProfile();

		return () => {
			active = false;
		};
	}, [form]);

	async function handleSubmit(values: ProfileFormValues) {
		try {
			setStatus("submitting");
			setErrorMessage(null);

			const response = await authorizedFetch("/api/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			if (!response.ok) {
				const message = await response.json().catch(() => ({}));
				throw new Error(message.error ?? "Unable to save profile");
			}

			const updated: ProfileResponse = await response.json();
			form.reset({
				displayName: updated.displayName ?? values.displayName,
				role: updated.role ?? values.role,
				headline: updated.headline ?? values.headline ?? "",
				gradYear: updated.gradYear ?? values.gradYear ?? "",
				linkedinUrl: updated.linkedinUrl ?? values.linkedinUrl,
				githubUrl: updated.githubUrl ?? values.githubUrl ?? "",
				avatarUrl: updated.avatarUrl ?? values.avatarUrl ?? "",
			});
			setStatus("success");
			onSuccess?.(updated);
		} catch (error) {
			console.error(error);
			setStatus("error");
			setErrorMessage(
				error instanceof Error
					? error.message
					: "Unable to save profile",
			);
		} finally {
			setTimeout(() => setStatus("idle"), 3000);
		}
	}

	async function handleAvatarFileChange(
		event: ChangeEvent<HTMLInputElement>,
	) {
		const file = event.target.files?.[0];
		if (!file) return;

		setAvatarError(null);
		setUploadingAvatar(true);

		try {
			const publicUrl = await uploadProfileAvatar(file);
			form.setValue("avatarUrl", publicUrl, {
				shouldDirty: true,
				shouldValidate: true,
			});
			form.clearErrors("avatarUrl");
		} catch (error) {
			console.error(error);
			if (error instanceof AvatarUploadError) {
				setAvatarError(error.message);
			} else {
				setAvatarError("Failed to upload image. Please try again.");
			}
		} finally {
			setUploadingAvatar(false);
			event.target.value = "";
		}
	}

	function handleRemoveAvatar() {
		form.setValue("avatarUrl", "", {
			shouldDirty: true,
			shouldValidate: true,
		});
		form.clearErrors("avatarUrl");
		setAvatarError(null);
	}

	const watchValues = form.watch();
	const previewData = useMemo(
		() => ({
			displayName: watchValues.displayName,
			role: watchValues.role,
			headline: watchValues.headline,
			gradYear: watchValues.gradYear,
			linkedinUrl: watchValues.linkedinUrl,
			githubUrl: watchValues.githubUrl,
			avatarUrl: watchValues.avatarUrl,
		}),
		[
			watchValues.displayName,
			watchValues.role,
			watchValues.headline,
			watchValues.gradYear,
			watchValues.linkedinUrl,
			watchValues.githubUrl,
			watchValues.avatarUrl,
		],
	);

	if (initializing) {
		return (
			<div className="rounded-lg border p-6">
				<p className="text-sm text-muted-foreground">
					Loading profile…
				</p>
			</div>
		);
	}

	return (
		<div
			className={clsx(
				"grid gap-6 items-start",
				showPreview &&
					"lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]",
			)}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="space-y-5 rounded-lg border p-6"
				>
					<div>
						<h2 className="text-xl font-semibold">
							Member Profile
						</h2>
						<p className="text-sm text-muted-foreground">
							Add the details we share on the club directory.
						</p>
					</div>

					<FormField
						control={form.control}
						name="avatarUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Profile photo</FormLabel>
								<FormControl>
									<div className="flex items-center gap-4">
										<input
											type="hidden"
											{...field}
											value={field.value ?? ""}
										/>
										<div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-muted">
											{field.value ? (
												<img
													src={field.value}
													alt="Profile photo preview"
													className="h-full w-full object-cover"
												/>
											) : (
												<span className="text-lg font-semibold text-muted-foreground">
													{previewData.displayName?.charAt(
														0,
													) ?? "?"}
												</span>
											)}
										</div>
										<div className="flex flex-1 flex-col gap-2">
											<input
												ref={fileInputRef}
												type="file"
												accept="image/png,image/jpeg,image/webp,image/gif"
												className="hidden"
												onChange={
													handleAvatarFileChange
												}
											/>
											<div className="flex flex-wrap gap-2">
												<Button
													type="button"
													variant="secondary"
													onClick={() =>
														fileInputRef.current?.click()
													}
													disabled={uploadingAvatar}
												>
													{uploadingAvatar
														? "Uploading…"
														: "Upload photo"}
												</Button>
												{field.value && (
													<Button
														type="button"
														variant="ghost"
														onClick={
															handleRemoveAvatar
														}
														disabled={
															uploadingAvatar
														}
													>
														Remove
													</Button>
												)}
											</div>
											<p className="text-xs text-muted-foreground">
												PNG, JPG, WebP, or GIF up to
												5MB.
											</p>
											{avatarError && (
												<p className="text-xs text-destructive">
													{avatarError}
												</p>
											)}
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="displayName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Display name</FormLabel>
								<FormControl>
									<Input
										placeholder="Jordan Doe"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="role"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Role</FormLabel>
								<FormControl>
									<select
										{...field}
										className="w-full rounded-md border bg-background px-3 py-2 text-sm"
									>
										<option value="member">Member</option>
										<option value="mentor">Mentor</option>
										<option value="executive">
											Executive
										</option>
									</select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="headline"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Headline</FormLabel>
								<FormControl>
									<Textarea
										rows={3}
										placeholder="Full-stack builder • AI project lead"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="gradYear"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Graduation year</FormLabel>
								<FormControl>
									<Input
										placeholder="2026"
										maxLength={4}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="linkedinUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>LinkedIn profile URL</FormLabel>
								<FormControl>
									<Input
										type="url"
										placeholder="https://www.linkedin.com/in/your-handle"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="githubUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									GitHub profile URL (optional)
								</FormLabel>
								<FormControl>
									<Input
										type="url"
										placeholder="https://github.com/your-handle"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full"
						disabled={status === "submitting"}
					>
						{status === "submitting" ? "Saving…" : "Save profile"}
					</Button>

					{status === "success" && (
						<p className="text-sm text-green-600">
							Profile saved successfully.
						</p>
					)}
					{status === "error" && (
						<p className="text-sm text-destructive">
							{errorMessage}
						</p>
					)}
					{errorMessage && status !== "error" && (
						<p className="text-sm text-destructive">
							{errorMessage}
						</p>
					)}
				</form>
			</Form>

			{showPreview && (
				<div className="h-full rounded-lg border bg-card p-6 shadow-sm">
					<h2 className="text-xl font-semibold">Directory Preview</h2>
					<p className="text-sm text-muted-foreground">
						This is how you will appear on the members page.
					</p>

					<div className="mt-6 rounded-lg border bg-background p-5">
						<div className="flex items-center gap-4">
							<div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
								{previewData.avatarUrl ? (
									<img
										src={previewData.avatarUrl}
										alt="Profile photo preview"
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground">
										{previewData.displayName?.charAt(0) ??
											"?"}
									</div>
								)}
							</div>
							<div>
								<p className="text-lg font-semibold">
									{previewData.displayName || "Your name"}
								</p>
								<p className="text-sm text-muted-foreground capitalize">
									{previewData.role}
								</p>
								{previewData.gradYear && (
									<p className="text-xs text-muted-foreground">
										Class of {previewData.gradYear}
									</p>
								)}
							</div>
						</div>

						{previewData.headline && (
							<p className="mt-4 text-sm text-muted-foreground">
								{previewData.headline}
							</p>
						)}

						<div className="mt-4 flex gap-3">
							{previewData.linkedinUrl ? (
								<a
									href={previewData.linkedinUrl}
									target="_blank"
									rel="noreferrer"
									className="text-sm font-medium text-blue-600 hover:underline"
								>
									LinkedIn
								</a>
							) : (
								<span className="text-sm text-muted-foreground">
									Add LinkedIn URL
								</span>
							)}
							{previewData.githubUrl ? (
								<a
									href={previewData.githubUrl}
									target="_blank"
									rel="noreferrer"
									className="text-sm font-medium text-foreground hover:underline"
								>
									GitHub
								</a>
							) : (
								<span className="text-sm text-muted-foreground">
									GitHub optional
								</span>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
