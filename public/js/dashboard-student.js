const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");
const logoutButton = document.getElementById("logoutButton");

toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

// Ambil data user dari localStorage jika sudah login.
// Kalau belum ada, pakai data dummy agar halaman tetap tampil.
const savedUser = localStorage.getItem("gamigame_user");

let student = {
  full_name: "NIKI",
  username: "NIKI",
  role: "student",
};

if (savedUser) {
  try {
    student = JSON.parse(savedUser);
  } catch (error) {
    console.log("Data user tidak valid");
  }
}

const displayName = student.full_name || student.username || "Siswa";

document.getElementById("studentName").textContent = displayName;
document.getElementById("studentNameTop").textContent = displayName;

const avatar = document.querySelector(".avatar");
avatar.textContent = displayName.charAt(0).toUpperCase();

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("gamigame_token");
  localStorage.removeItem("gamigame_user");

  window.location.href = "/login";
});