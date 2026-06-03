const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const verificationEmailHTML = (name, verifyUrl) => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Verifikasi Email Gamigame</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95);padding:36px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <span style="display:inline-block;width:44px;height:44px;background:rgba(255,255,255,0.15);border-radius:14px;font-size:24px;line-height:44px;text-align:center;">🎮</span>
                <span style="color:#ffffff;font-size:22px;font-weight:900;vertical-align:middle;margin-left:8px;">Gamigame</span>
              </div>
              <p style="color:#c4b5fd;margin:12px 0 0;font-size:14px;">Platform Gamifikasi Pendidikan</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#1e1b4b;">Halo, ${name}! 👋</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.7;">
                Terima kasih sudah mendaftar di Gamigame! Satu langkah lagi — verifikasi emailmu untuk mulai belajar dan mengumpulkan poin.
              </p>

              <!-- Button -->
              <div style="text-align:center;margin:28px 0;">
                <a href="${verifyUrl}"
                   style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#ffffff;text-decoration:none;border-radius:999px;font-size:16px;font-weight:800;box-shadow:0 8px 24px rgba(124,58,237,0.35);">
                  ✅ Verifikasi Email Sekarang
                </a>
              </div>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f5f3ff;border-radius:12px;padding:16px 20px;border-left:4px solid #7c3aed;">
                    <p style="margin:0;font-size:13px;color:#5b21b6;line-height:1.6;">
                      ⏱ Link ini berlaku selama <strong>24 jam</strong>. Jika tidak diminta oleh kamu, abaikan email ini.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
                Atau salin dan tempel link berikut ke browser:<br/>
                <a href="${verifyUrl}" style="color:#7c3aed;word-break:break-all;">${verifyUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; ${new Date().getFullYear()} Gamigame. Hak cipta dilindungi.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const resetPasswordEmailHTML = (name, resetUrl) => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Reset Password Gamigame</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">
          <tr>
            <td style="background:linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95);padding:36px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <span style="display:inline-block;width:44px;height:44px;background:rgba(255,255,255,0.15);border-radius:14px;font-size:24px;line-height:44px;text-align:center;">🎮</span>
                <span style="color:#ffffff;font-size:22px;font-weight:900;vertical-align:middle;margin-left:8px;">Gamigame</span>
              </div>
              <p style="color:#c4b5fd;margin:12px 0 0;font-size:14px;">Platform Gamifikasi Pendidikan</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px 28px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#1e1b4b;">Reset Password, ${name}! 🔐</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.7;">
                Kami menerima permintaan untuk mereset password akun Gamigame kamu. Klik tombol di bawah untuk membuat password baru.
              </p>
              <div style="text-align:center;margin:28px 0;">
                <a href="${resetUrl}"
                   style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#ffffff;text-decoration:none;border-radius:999px;font-size:16px;font-weight:800;box-shadow:0 8px 24px rgba(124,58,237,0.35);">
                  🔑 Reset Password Sekarang
                </a>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f5f3ff;border-radius:12px;padding:16px 20px;border-left:4px solid #7c3aed;">
                    <p style="margin:0;font-size:13px;color:#5b21b6;line-height:1.6;">
                      ⏱ Link ini berlaku selama <strong>1 jam</strong>. Jika tidak merasa meminta reset password, abaikan email ini — akunmu aman.
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
                Atau salin dan tempel link berikut ke browser:<br/>
                <a href="${resetUrl}" style="color:#7c3aed;word-break:break-all;">${resetUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; ${new Date().getFullYear()} Gamigame. Hak cipta dilindungi.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const sendPasswordResetEmail = async (to, name, token) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Gamigame" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Password Akun Kamu — Gamigame",
    html: resetPasswordEmailHTML(name, resetUrl),
  });
};

const sendVerificationEmail = async (to, name, token) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  const verifyUrl = `${baseUrl}/verify?token=${token}`;
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Gamigame" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verifikasi Email Kamu — Gamigame",
    html: verificationEmailHTML(name, verifyUrl),
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
