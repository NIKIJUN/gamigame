const params = new URLSearchParams(window.location.search);
const token = params.get("token");

function showState(id) {
  ["stateLoading", "stateSuccess", "stateError", "stateNoToken"].forEach((s) => {
    document.getElementById(s).classList.toggle("hidden", s !== id);
  });
}

async function resendVerification(emailInputId, alertId, btnId) {
  const email = document.getElementById(emailInputId).value.trim();
  const alertEl = document.getElementById(alertId);
  const btn = document.getElementById(btnId);

  alertEl.className = "resend-alert hidden";

  if (!email) {
    alertEl.className = "resend-alert danger";
    alertEl.textContent = "Masukkan emailmu terlebih dahulu.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Mengirim...";

  try {
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await res.json();

    alertEl.className = result.success ? "resend-alert success" : "resend-alert danger";
    alertEl.textContent = result.message;
  } catch {
    alertEl.className = "resend-alert danger";
    alertEl.textContent = "Tidak dapat terhubung ke server.";
  } finally {
    btn.disabled = false;
    btn.textContent = "Kirim Ulang Email Verifikasi";
  }
}

// Wire up resend buttons
document.getElementById("resendBtn").addEventListener("click", () =>
  resendVerification("resendEmail", "resendAlert", "resendBtn")
);
document.getElementById("resendBtn2").addEventListener("click", () =>
  resendVerification("resendEmail2", "resendAlert2", "resendBtn2")
);

// Main flow
if (!token) {
  showState("stateNoToken");
} else {
  showState("stateLoading");

  fetch(`/api/auth/verify/${token}`)
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        showState("stateSuccess");
      } else {
        document.getElementById("errorMsg").textContent = result.message;
        showState("stateError");
      }
    })
    .catch(() => {
      document.getElementById("errorMsg").textContent =
        "Tidak dapat terhubung ke server. Coba lagi nanti.";
      showState("stateError");
    });
}
