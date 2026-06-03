const loginForm = document.getElementById("loginForm");
const alertBox = document.getElementById("alertBox");
const loginBtn = document.getElementById("loginBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const roleInput = document.getElementById("role");
const roleTabs = document.querySelectorAll(".role-tab");
const tabIndicator = document.querySelector(".tab-indicator");
const registerLink = document.getElementById("registerLink");

// Forgot password modal elements
const forgotModal = document.getElementById("forgotModal");
const forgotModalCloseX = document.getElementById("forgotModalCloseX");
const forgotModalCancel = document.getElementById("forgotModalCancel");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const forgotSubmitBtn = document.getElementById("forgotSubmitBtn");
const forgotBtnText = document.getElementById("forgotBtnText");
const forgotBtnLoader = document.getElementById("forgotBtnLoader");
const forgotEmail = document.getElementById("forgotEmail");
const forgotAlertBox = document.getElementById("forgotAlertBox");

// Pre-select role from URL query param
const params = new URLSearchParams(window.location.search);
const initialRole = params.get("role") === "teacher" ? "teacher" : "student";
setRole(initialRole);
updateRegisterLink();

function setRole(role) {
  roleInput.value = role;
  roleTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.role === role));
  tabIndicator.classList.toggle("right", role === "teacher");
  updateRegisterLink();
}

function updateRegisterLink() {
  registerLink.href = `/register?role=${roleInput.value}`;
}

roleTabs.forEach((tab) => tab.addEventListener("click", () => setRole(tab.dataset.role)));

togglePassword.addEventListener("click", () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

function showAlert(type, html) {
  alertBox.className = `alert-box ${type}`;
  alertBox.innerHTML = html;
}

function hideAlert() {
  alertBox.className = "alert-box hidden";
  alertBox.innerHTML = "";
}

function setLoading(loading) {
  loginBtn.disabled = loading;
  btnText.textContent = loading ? "Memproses..." : "Masuk";
  btnLoader.classList.toggle("hidden", !loading);
}

async function sendResendRequest(email) {
  try {
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await res.json();
    showAlert(result.success ? "success" : "danger", result.message);
  } catch {
    showAlert("danger", "Tidak dapat terhubung ke server.");
  }
}

// ── Forgot Password Modal ────────────────────────────────────────────────────

function openForgotModal() {
  forgotEmail.value = document.getElementById("email").value.trim();
  forgotAlertBox.className = "alert-box hidden";
  forgotAlertBox.innerHTML = "";
  forgotSubmitBtn.style.display = "";
  setForgotLoading(false);
  forgotModal.classList.remove("hidden");
  forgotEmail.focus();
}

function closeForgotModal() {
  forgotModal.classList.add("hidden");
}

function setForgotLoading(loading) {
  forgotSubmitBtn.disabled = loading;
  forgotBtnText.textContent = loading ? "Mengirim..." : "Kirim Link Reset";
  forgotBtnLoader.classList.toggle("hidden", !loading);
}

function showForgotAlert(type, message) {
  forgotAlertBox.className = `alert-box ${type}`;
  forgotAlertBox.textContent = message;
}

forgotPasswordLink.addEventListener("click", (e) => {
  e.preventDefault();
  openForgotModal();
});

forgotModalCloseX.addEventListener("click", closeForgotModal);
forgotModalCancel.addEventListener("click", closeForgotModal);

forgotModal.addEventListener("click", (e) => {
  if (e.target === forgotModal) closeForgotModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !forgotModal.classList.contains("hidden")) closeForgotModal();
});

forgotSubmitBtn.addEventListener("click", async () => {
  const email = forgotEmail.value.trim();

  if (!email) {
    showForgotAlert("danger", "Masukkan email kamu terlebih dahulu.");
    return;
  }

  setForgotLoading(true);
  forgotAlertBox.className = "alert-box hidden";

  try {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await res.json();

    if (result.success) {
      showForgotAlert("success", result.message);
      forgotSubmitBtn.style.display = "none";
    } else {
      showForgotAlert("danger", result.message || "Terjadi kesalahan. Coba lagi.");
    }
  } catch {
    showForgotAlert("danger", "Tidak dapat terhubung ke server.");
  } finally {
    setForgotLoading(false);
  }
});

// ─────────────────────────────────────────────────────────────────────────────

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAlert();

  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showAlert("danger", "Email dan password wajib diisi.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      if (result.code === "EMAIL_NOT_VERIFIED") {
        showAlert(
          "danger",
          `${result.message} <button id="resendInline" style="margin-top:8px;display:block;width:100%;padding:8px;background:#7c3aed;color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit;">Kirim Ulang Email Verifikasi</button>`
        );
        document.getElementById("resendInline").addEventListener("click", () =>
          sendResendRequest(email)
        );
      } else {
        showAlert("danger", result.message || "Email atau password salah.");
      }
      return;
    }

    localStorage.setItem("gamigame_token", result.data.token);
    localStorage.setItem("gamigame_user", JSON.stringify(result.data.user));

    showAlert("success", "Login berhasil! Mengalihkan...");
    const role = result.data.user.role;
    setTimeout(() => {
      window.location.href = role === "teacher" ? "/dashboard-teacher" : "/dashboard-student";
    }, 700);
  } catch {
    showAlert("danger", "Tidak dapat terhubung ke server. Pastikan server berjalan.");
  } finally {
    setLoading(false);
  }
});
