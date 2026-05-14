const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Tutup menu saat link diklik di tampilan mobile
const links = document.querySelectorAll(".nav-links a");

links.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Efek alert saat tombol daftar diklik
const daftarButtons = document.querySelectorAll(".class-card button");

daftarButtons.forEach(button => {
  button.addEventListener("click", () => {
    alert("Terima kasih! Kamu berhasil memilih kelas.");
  });
});