const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");
const startQuizButton = document.getElementById("startQuizButton");

toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

const savedUser = localStorage.getItem("gamigame_user");

let student = {
  full_name: "Fahmira",
  username: "fahmira",
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

document.getElementById("studentNameTop").textContent = displayName;

const avatar = document.querySelector(".avatar");
avatar.textContent = displayName.charAt(0).toUpperCase();

startQuizButton.addEventListener("click", () => {
  window.location.href = "/quiz";
});