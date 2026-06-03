const params = new URLSearchParams(window.location.search);
const token = params.get("token");

const alertBox = document.getElementById("alertBox");
const resetForm = document.getElementById("resetForm");
const resetBtn = document.getElementById("resetBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const strengthFill = document.getElementById("strengthFill");
const strengthLabel = document.getElementById("strengthLabel");

// Redirect if no token
if (!token) {
  showTokenError();
}

document.getElementById("togglePassword").addEventListener("click", () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

document.getElementById("toggleConfirm").addEventListener("click", () => {
  confirmInput.type = confirmInput.type === "password" ? "text" : "password";
});

// Password strength meter
passwordInput.addEventListener("input", () => {
  const val = passwordInput.value;
  const score = getStrengthScore(val);
  const colors = ["", "#ef4444", "#f59e0b", "#10b981", "#7c3aed"];
  const labels = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];

  strengthFill.style.width = score ? `${score * 25}%` : "0%";
  strengthFill.style.background = colors[score] || "";
  strengthLabel.textContent = val ? labels[score] : "";
  strengthLabel.style.color = colors[score] || "";
});

function getStrengthScore(pwd) {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.max(1, score);
}

function showAlert(type, message) {
  alertBox.className = `alert-box ${type}`;
  alertBox.textContent = message;
}

function setLoading(loading) {
  resetBtn.disabled = loading;
  btnText.textContent = loading ? "Menyimpan..." : "Simpan Password Baru";
  btnLoader.classList.toggle("hidden", !loading);
}

function showTokenError() {
  if (resetForm) resetForm.style.display = "none";
  const card = document.querySelector(".auth-card");
  const errorDiv = document.createElement("div");
  errorDiv.className = "token-error";
  errorDiv.innerHTML = `
    <div class="error-icon">⚠️</div>
    <h2>Link Tidak Valid</h2>
    <p>Link reset password ini tidak valid atau sudah kadaluarsa (berlaku 1 jam). Silakan minta link reset baru.</p>
    <a href="/login" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;text-decoration:none;border-radius:12px;font-weight:800;font-size:0.95rem;">Kembali ke Login</a>
  `;
  // Insert after auth-sub
  const sub = card.querySelector(".auth-sub");
  if (sub) sub.insertAdjacentElement("afterend", errorDiv);
}

resetForm && resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = passwordInput.value;
  const confirm = confirmInput.value;

  if (!password || password.length < 8) {
    showAlert("danger", "Password baru minimal 8 karakter.");
    return;
  }

  if (password !== confirm) {
    showAlert("danger", "Konfirmasi password tidak cocok.");
    return;
  }

  setLoading(true);
  alertBox.className = "alert-box hidden";

  try {
    const res = await fetch(`/api/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const result = await res.json();

    if (result.success) {
      showAlert("success", result.message);
      resetForm.style.display = "none";
      setTimeout(() => {
        window.location.href = "/login";
      }, 2500);
    } else {
      if (res.status === 400) {
        showTokenError();
      } else {
        showAlert("danger", result.message || "Terjadi kesalahan. Coba lagi.");
      }
    }
  } catch {
    showAlert("danger", "Tidak dapat terhubung ke server.");
  } finally {
    setLoading(false);
  }
});
