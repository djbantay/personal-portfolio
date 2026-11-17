import { Resend } from "resend";
import { PROFILE } from "@/lib/profile";
import { rateLimit, clientId, tooMany } from "@/lib/ratelimit";
import { clean } from "@/lib/text";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body.website) return Response.json({ ok: true }); // honeypot
  const name = clean(body.name, 60);
  const email = clean(body.email, 120);
  const subject = clean(body.subject, 120) || "hello from your portfolio";
  const message = typeof body.message === "string" ? body.message.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim().slice(0, 2000) : "";

  if (!EMAIL_RE.test(email)) return Response.json({ error: "that email address doesn't look right" }, { status: 400 });
  if (message.length < 2) return Response.json({ error: "message is empty" }, { status: 400 });

  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: `mail is offline right now. email ${PROFILE.links.email} directly.` }, { status: 503 });
  }

  const rl = await rateLimit("mail", clientId(req), 3, 3600);
  if (!rl.ok) return tooMany(rl.retryAfter, "messages");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.MAIL_FROM ?? "DANIEL_OS <onboarding@resend.dev>",
      to: process.env.MAIL_TO ?? PROFILE.links.email,
      replyTo: email,
      subject: `[portfolio] ${subject}`,
      text: `From: ${name || "(no name)"} <${email}>\n\n${message}\n\n— sent via the \`mail\` command on your portfolio`,
    });
    if (error) throw new Error(error.message);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("mail failed", e);
    return Response.json({ error: `couldn't send right now. email ${PROFILE.links.email} directly.` }, { status: 502 });
  }
}
