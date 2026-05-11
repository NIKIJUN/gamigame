const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");
const logoutButton = document.getElementById("logoutButton");

const materialForm = document.getElementById("materialForm");
const quizForm = document.getElementById("quizForm");
const materialTableBody = document.getElementById("materialTableBody");

toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

const savedUser = localStorage.getItem("gamigame_user");

let teacher = {
  full_name: "Guru",
  username: "guru",
  role: "teacher",
};

if (savedUser) {
  try {
    teacher = JSON.parse(savedUser);
  } catch (error) {
    console.log("Data user tidak valid");
  }
}

const displayName = teacher.full_name || teacher.username || "Guru";

document.getElementById("teacherName").textContent = displayName;
document.getElementById("teacherNameTop").textContent = displayName;

const avatar = document.querySelector(".avatar");
avatar.textContent = displayName.charAt(0).toUpperCase();

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("gamigame_token");
  localStorage.removeItem("gamigame_user");

  window.location.href = "/login";
});

materialForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("materialTitle").value.trim();
  const subject = document.getElementById("materialSubject").value;
  const description = document.getElementById("materialDescription").value.trim();
  const status = document.getElementById("materialStatus").value;

  if (!title || !subject || !description) {
    alert("Semua field materi wajib diisi.");
    return;
  }

  const statusClass = status === "Aktif" ? "active" : "draft";

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>
      <strong>${title}</strong>
      <small>${description}</small>
    </td>
    <td>${subject}</td>
    <td><span class="status ${statusClass}">${status}</span></td>
    <td>Belum ada</td>
    <td>
      <button class="btn btn-sm btn-outline-primary action-btn edit-material">
        <i class="bi bi-pencil-square"></i>
      </button>
      <button class="btn btn-sm btn-outline-danger action-btn delete-row">
        <i class="bi bi-trash"></i>
      </button>
    </td>
  `;

  materialTableBody.appendChild(row);

  materialForm.reset();

  const modalElement = document.getElementById("materialModal");
  const modal = bootstrap.Modal.getInstance(modalElement);
  modal.hide();

  alert("Materi berhasil ditambahkan secara preview.");
});

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const quizTitle = document.getElementById("quizTitle").value.trim();
  const quizMaterial = document.getElementById("quizMaterial").value;
  const questionCount = document.getElementById("quizQuestionCount").value;
  const quizPoints = document.getElementById("quizPoints").value;
  const quizQuestion = document.getElementById("quizQuestion").value.trim();

  if (!quizTitle || !quizMaterial || !questionCount || !quizPoints || !quizQuestion) {
    alert("Semua field kuis wajib diisi.");
    return;
  }

  quizForm.reset();

  const modalElement = document.getElementById("quizModal");
  const modal = bootstrap.Modal.getInstance(modalElement);
  modal.hide();

  alert("Kuis berhasil dibuat secara preview. Nanti data ini bisa disimpan ke MongoDB.");
});

document.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-row");

  if (deleteButton) {
    const confirmDelete = confirm("Yakin ingin menghapus data ini?");

    if (confirmDelete) {
      deleteButton.closest("tr").remove();
      alert("Data berhasil dihapus secara preview.");
    }
  }

  const editButton = event.target.closest(".edit-material");

  if (editButton) {
    alert("Fitur edit masih preview. Nanti bisa dibuat modal edit khusus.");
  }
});