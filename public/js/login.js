const loginForm = document.getElementById("loginForm");
const alertBox = document.getElementById("alertBox");
const loginButton = document.getElementById("loginButton");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

const showAlert = (type, message) => {
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
};

const hideAlert = () => {
  alertBox.className = "alert d-none";
  alertBox.textContent = "";
};

togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";

  passwordInput.type = isPassword ? "text" : "password";
  togglePassword.textContent = isPassword ? "Sembunyikan" : "Lihat";
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideAlert();

  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showAlert("danger", "Email dan password wajib diisi.");
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Memproses...";

  setTimeout(() => {
    localStorage.setItem("gamigame_token", "dummy-token-preview");
    localStorage.setItem(
      "gamigame_user",
      JSON.stringify({
        id: "preview-user",
        full_name: "Preview User",
        username: "preview",
        email,
        role: "student",
        is_active: true,
      })
    );

    showAlert("success", "Preview login berhasil. Backend belum terhubung ke MongoDB.");

    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }, 700);
});