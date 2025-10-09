import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contacts, location, timestamp } = body;

    console.log("SOS Request received:", { contacts, location, timestamp });

    if (!contacts || contacts.length === 0) {
      return NextResponse.json(
        { error: "No contacts provided" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const googleMapsLink = location
      ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
      : "Location unavailable";

    const emailPromises = contacts.map(
      (contact: { name: string; email: string }) => {
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; }
    .alert-box { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
    .info-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
    .steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🚨 EMERGENCY SOS ALERT</h1>
    </div>
    
    <div class="content">
      <div class="alert-box">
        <strong>⚠️ IMMEDIATE ATTENTION REQUIRED</strong>
        <p>This is an automated emergency alert from SpeakUp.</p>
      </div>

      <p>Dear ${contact.name},</p>
      
      <p>Someone who has added you as an emergency contact has activated an SOS alert and needs immediate help.</p>

      <div class="info-row">
        <strong>Alert Time:</strong><br/>
        ${timestamp}
      </div>

      ${
        location
          ? `
      <div class="info-row">
        <strong>Location:</strong><br/>
        Latitude: ${location.lat}<br/>
        Longitude: ${location.lng}<br/>
        <a href="${googleMapsLink}" class="button" style="color: white;">📍 View on Google Maps</a>
      </div>
      `
          : "<p>Location information unavailable</p>"
      }

      <div class="steps">
        <h3 style="color: #dc2626; margin-top: 0;">Immediate Actions Required:</h3>
        <ol>
          <li>Try calling them immediately</li>
          <li>If no response, contact emergency services (911)</li>
          <li>Check their location using the map link above</li>
          <li>Alert other trusted individuals if needed</li>
        </ol>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="tel:911" class="button" style="color: white;">📞 Call 911</a>
        ${
          location
            ? `<a href="${googleMapsLink}" class="button" style="background: #2563eb; color: white;">🗺️ View Location</a>`
            : ""
        }
      </div>
    </div>

    <div class="footer">
      <p>This is an automated message from SpeakUp Emergency Alert System.</p>
      <p><strong>SpeakUp</strong> - Supporting survivors, empowering voices</p>
    </div>
  </div>
</body>
</html>
      `;

        const textContent = `
🚨 EMERGENCY SOS ALERT

${contact.name},

This is an automated emergency alert from SpeakUp.

Alert Time: ${timestamp}
${
  location
    ? `Location: ${googleMapsLink}\nCoordinates: ${location.lat}, ${location.lng}`
    : "Location unavailable"
}

Someone who added you as an emergency contact needs immediate help.

IMMEDIATE ACTIONS:
1. Try calling them immediately
2. If no response, contact emergency services (911)
3. Check their location: ${googleMapsLink}
4. Alert other trusted individuals if needed

---
SpeakUp Emergency Alert System
      `;

        return resend.emails.send({
          from: "SpeakUp Emergency <onboarding@resend.dev>",
          to: contact.email,
          subject: "🚨 EMERGENCY SOS ALERT",
          html: htmlContent,
          text: textContent,
        });
      }
    );

    const results = await Promise.allSettled(emailPromises);

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log("Email results:", { successful, failed });

    if (failed > 0) {
      console.error(
        "Some emails failed:",
        results.filter((r) => r.status === "rejected")
      );
    }

    return NextResponse.json({
      success: true,
      message: `SOS alerts sent to ${successful} contact(s)`,
      failed: failed,
    });
  } catch (error) {
    console.error("SOS API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to send SOS alerts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
