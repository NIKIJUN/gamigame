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
