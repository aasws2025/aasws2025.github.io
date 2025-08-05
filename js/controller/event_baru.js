import { BASE_HOST } from "../template/url.js";

// Helpers
function getCookie(name) {
  const cookie = document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

// Main
const token = getCookie("token");
const form = document.getElementById("eventForm");
const errorEl = document.getElementById("errorMessage");

// Submit new event data
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const eventData = {
    judul: document.getElementById("judul").value.trim(),
    tanggal: document.getElementById("tanggal").value,
    harga: document.getElementById("harga").value.trim(),
    lokasi: document.getElementById("lokasi").value.trim(),
    deskripsi: document.getElementById("deskripsi").value.trim(),
    kategori: document.getElementById("kategori").value.trim(),
  };

  try {
    const res = await fetch(`${BASE_HOST}/api/protected/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Gagal membuat event.");
    }

    alert("Event berhasil dibuat!");
    window.location.href = "index.html";

  } catch (err) {
    errorEl.textContent = err.message;
    console.error("Create error:", err);
  }
});
