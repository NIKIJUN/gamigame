const registerForm = document.getElementById("registerForm");
const alertBox = document.getElementById("alertBox");
const registerBtn = document.getElementById("registerBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const roleInput = document.getElementById("role");
const roleTabs = document.querySelectorAll(".role-tab");
const tabIndicator = document.querySelector(".tab-indicator");
const loginLink = document.getElementById("loginLink");

// Pre-select role from URL query param
const params = new URLSearchParams(window.location.search);
const initialRole = params.get("role") === "teacher" ? "teacher" : "student";
setRole(initialRole);

updateLoginLink();

function setRole(role) {
  roleInput.value = role;
  roleTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.role === role);
  });
  if (role === "teacher") {
    tabIndicator.classList.add("right");
  } else {
    tabIndicator.classList.remove("right");
  }
  updateLoginLink();
}

function updateLoginLink() {
  loginLink.href = `/login?role=${roleInput.value}`;
}

roleTabs.forEach((tab) => {
  tab.addEventListener("click", () => setRole(tab.dataset.role));
});

// Toggle password visibility
togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
});

toggleConfirmPassword.addEventListener("click", () => {
  const isHidden = confirmPasswordInput.type === "password";
  confirmPasswordInput.type = isHidden ? "text" : "password";
});

function showAlert(type, message) {
  alertBox.className = `alert-box ${type}`;
  alertBox.textContent = message;
  alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideAlert() {
  alertBox.className = "alert-box hidden";
  alertBox.textContent = "";
}

function setLoading(loading) {
  registerBtn.disabled = loading;
  btnText.textContent = loading ? "Memproses..." : "Daftar Sekarang";
  btnLoader.classList.toggle("hidden", !loading);
}

const isValidUsername = (v) => /^[A-Za-z0-9_]+$/.test(v);
const isValidPassword = (v) => v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v);

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAlert();

  const role = roleInput.value;
  const full_name = document.getElementById("full_name").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!full_name || !username || !email || !password || !confirmPassword) {
    showAlert("danger", "Semua field wajib diisi.");
    return;
  }

  if (full_name.length < 3 || full_name.length > 100) {
    showAlert("danger", "Nama lengkap harus 3–100 karakter.");
    return;
  }

  if (username.length < 3 || username.length > 50) {
    showAlert("danger", "Username harus 3–50 karakter.");
    return;
  }

  if (!isValidUsername(username)) {
    showAlert("danger", "Username hanya boleh berisi huruf, angka, dan underscore.");
    return;
  }

  if (!isValidPassword(password)) {
    showAlert("danger", "Password minimal 8 karakter, harus ada huruf kapital dan angka.");
    return;
  }

  if (password !== confirmPassword) {
    showAlert("danger", "Konfirmasi password tidak sama.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, full_name, username, email, password }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      showAlert("danger", result.message || "Pendaftaran gagal.");
      return;
    }

    showAlert(
      "success",
      `Pendaftaran berhasil! 🎉 Kami mengirim link verifikasi ke <strong>${email}</strong>. Cek inbox (dan folder spam) kamu, lalu klik link untuk mengaktifkan akun.`
    );
    registerForm.reset();
  } catch {
    showAlert("danger", "Tidak dapat terhubung ke server. Pastikan server berjalan.");
  } finally {
    setLoading(false);
  }
});
