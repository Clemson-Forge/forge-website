import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
	try {
		const resend = new Resend(process.env.RESEND_API_KEY);

		const request = await req.json();
		const { name, email, subject, message } = request;

		console.log(request);

		const res = await resend.emails.send({
			to: ["contact@clemsonforge.org"],
			subject: `Contact Form: ${subject}`,
			html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
			from: "Clemson Forge <noreply@clemsonforge.org>",
		});

		console.log(res);

		return NextResponse.json({
			success: true,
			message: "Email sent successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to send information: " + error },
			{ status: 500 },
		);
	}
}
