const registerForm = document.getElementById("registerForm");
const alertBox = document.getElementById("alertBox");
const registerButton = document.getElementById("registerButton");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const showAlert = (type, message) => {
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
};

const hideAlert = () => {
  alertBox.className = "alert d-none";
  alertBox.textContent = "";
};

const isValidUsername = (username) => {
  return /^[A-Za-z0-9_]+$/.test(username);
};

const isValidPassword = (password) => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return password.length >= 8 && hasUppercase && hasNumber;
};

togglePassword.addEventListener("click", () => {
  const isPasswordHidden = passwordInput.type === "password";

  passwordInput.type = isPasswordHidden ? "text" : "password";
  togglePassword.textContent = isPasswordHidden ? "Sembunyikan" : "Lihat";
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideAlert();

  const role = document.getElementById("role").value;
  const full_name = document.getElementById("full_name").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!role || !full_name || !username || !email || !password || !confirmPassword) {
    showAlert("danger", "Semua field wajib diisi.");
    return;
  }

  if (full_name.length < 3 || full_name.length > 100) {
    showAlert("danger", "Nama lengkap harus 3 sampai 100 karakter.");
    return;
  }

  if (username.length < 3 || username.length > 50) {
    showAlert("danger", "Username harus 3 sampai 50 karakter.");
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

  registerButton.disabled = true;
  registerButton.textContent = "Memproses...";

  try {
    const endpoint =
      role === "teacher"
        ? "/api/auth/register/teacher"
        : "/api/auth/register/student";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name,
        username,
        email,
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      showAlert("danger", result.message || "Pendaftaran gagal.");
      return;
    }

    showAlert("success", "Pendaftaran berhasil. Silakan login.");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  } catch (error) {
    showAlert("danger", "Backend belum aktif atau server tidak dapat dihubungi.");
  } finally {
    registerButton.disabled = false;
    registerButton.textContent = "Daftar";
  }
});