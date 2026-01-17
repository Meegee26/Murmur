import sendGrid from "../config/sendGrid.js";

export const sendOtpEmail = async (email, otp) => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7048e8; margin: 0; font-size: 42px; letter-spacing: -0.5px; font-weight: 900">Murmur</h1>
        <p style="color: #868e96; font-size: 14px; margin-top: 5px;">Your Secure Chat Workspace</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 20px;">
        <p style="font-size: 16px; color: #495057; margin-bottom: 8px;">Welcome! 👋</p>
        <p style="font-size: 14px; color: #868e96; line-height: 1.5; margin: 0;">
          Thank you for joining Murmur! I'm excited to have you here. To complete your registration, please verify your email address with the code below.
        </p>
      </div>
      
      <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
        <p style="font-size: 14px; color: #495057; margin-bottom: 10px; font-weight: 600;">Your Verification Code</p>
        <h2 style="font-size: 36px; color: #212529; margin: 10px 0; letter-spacing: 5px; font-weight: 800;">${otp}</h2>
        <p style="font-size: 14px; color: #adb5bd;">This code will expire in <strong>10 minutes</strong>.</p>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <p style="font-size: 13px; color: #868e96; line-height: 1.5;">
          If you didn't request this code, you can safely ignore this email. Someone might have typed your email address by mistake.
        </p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #adb5bd;">&copy; 2026 Murmur. Built by Migz.Dev</p>
        </div>
      </div>
    </div>
  `;

  try {
    console.log("[MAILER] Sending email via SendGrid...");
    const msg = {
      to: email,
      from: {
        email: "jesusmigueldulfo@gmail.com",
        name: "Murmur",
      },
      subject: `Your Verification Code: ${otp}`,
      html: htmlContent,
    };

    const result = await sendGrid.send(msg);
    return result;
  } catch (error) {
    console.error("[MAILER] Full error:", error);
    throw error;
  }
};
