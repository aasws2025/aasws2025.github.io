import { BASE_HOST } from "../template/url.js";

// Helpers
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function getCookie(name) {
  const cookie = document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

// Main
const eventId = getQueryParam("id");
const token = getCookie("token");
const form = document.getElementById("eventForm");
const errorEl = document.getElementById("errorMessage");

// Load data into form
async function loadEventData() {
  if (!eventId) {
    errorEl.textContent = "Event ID tidak ditemukan di URL.";
    return;
  }

  try {
    const res = await fetch(`${BASE_HOST}/api/event/${eventId}`);
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Gagal memuat data event.");
    }

    const data = result.data;

    document.getElementById("judul").value = data.judul || "";
    document.getElementById("tanggal").value = data.tanggal || "";
    document.getElementById("harga").value = data.harga || "";
    document.getElementById("lokasi").value = data.lokasi || "";
    document.getElementById("deskripsi").value = data.deskripsi || "";
    document.getElementById("kategori").value = data.kategori || "";

  } catch (err) {
    errorEl.textContent = err.message;
    console.error("Load error:", err);
  }
}

// Submit updated data
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
    const res = await fetch(`${BASE_HOST}/api/protected/event/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Gagal memperbarui event.");
    }

    alert("Event berhasil diperbarui!");
    window.location.href = "index.html";

  } catch (err) {
    errorEl.textContent = err.message;
    console.error("Update error:", err);
  }
});

// Init
loadEventData();
