import { BASE_HOST, ENDPOINTS, PROTECTED_ENDPOINTS } from "../template/url.js";

// Helpers
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getCookieValue(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });
}

// DOM references
const errorEl = document.getElementById("errorMessage");
const container = document.getElementById("eventContainer");
const eventId = getQueryParam("id");
const token = getCookieValue("token");

async function loadDetail() {
  if (!eventId) {
    showError("ID event tidak ditemukan di URL.");
    return;
  }

  try {
    const res = await fetch(`${BASE_HOST}${ENDPOINTS.EVENT}/${eventId}`);
    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Gagal memuat data.");

    const e = result.data;

    container.innerHTML = `
      <div class="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <span class="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide">
            ${e.kategori || "Lainnya"}
          </span>
          <h2 class="mt-2 text-3xl font-bold text-gray-900">${e.judul}</h2>
          <p class="mt-1 text-sm text-gray-500 flex items-center gap-1">
            📅 <span>${formatDate(e.tanggal)}</span>
          </p>
          <p class="mt-1 text-sm text-gray-500 flex items-center gap-1">
            📍 <span>${e.lokasi}</span>
          </p>
        </div>
        <div class="flex items-center">
          <span class="text-3xl font-semibold text-green-600">Rp${Number(e.harga).toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-6 space-y-4">
        <div class="prose prose-sm text-gray-700 whitespace-pre-line">${e.deskripsi}</div>
      </div>

      <div id="actionBtns" class="mt-8 flex gap-3 flex-wrap"></div>
    `;

    // Fade-in animation (if container had opacity-0 class initially)
    container.classList.remove("opacity-0");
    container.classList.add("opacity-100");

    // If user is authenticated, show Edit/Delete
    if (token) {
      const actions = document.getElementById("actionBtns");

      // Edit Button
      const edit = document.createElement("a");
      edit.href = `event_edit.html?id=${eventId}`;
      edit.innerHTML = "✏️ <span>Edit</span>";
      edit.className =
        "inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition text-sm";
      actions.appendChild(edit);

      // Delete Button
      const del = document.createElement("button");
      del.innerHTML = "🗑️ <span>Hapus</span>";
      del.className =
        "inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-sm transition text-sm";
      del.addEventListener("click", async () => {
        if (!confirm(`Yakin ingin menghapus "${e.judul}"?`)) return;
        try {
          const r2 = await fetch(`${BASE_HOST}${PROTECTED_ENDPOINTS.EVENT}/${eventId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!r2.ok) throw new Error();
          alert("Event berhasil dihapus.");
          window.location.href = "index.html";
        } catch {
          alert("Gagal menghapus event.");
        }
      });
      actions.appendChild(del);
    }

  } catch (err) {
    showError(err.message);
  }
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
  container.innerHTML = "";
}

loadDetail();
