import { NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, deviceFingerprint } = body;

    if (!userId || !deviceFingerprint) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const timeStep = Math.floor(Date.now() / 10000);
    const secret = `${userId}-${deviceFingerprint}-BMTC-SECRET-KEY`;
    const message = `${secret}-${timeStep}`;

    const hmac = createHmac("sha1", secret);
    hmac.update(message);
    const digest = hmac.digest("hex");

    const totpCode = digest.substring(0, 16).toUpperCase();

    return NextResponse.json({
      code: totpCode,
      timeStep,
      mode: "SERVER",
      generatedAt: new Date().toISOString(),
      validFor: 10,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server TOTP generation failed" }, { status: 500 });
  }
}
