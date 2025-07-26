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

// Main
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
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div class="flex-1">
        <span class="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            ${e.kategori || "Lainnya"}
        </span>
        <h1 class="mt-2 text-4xl font-bold text-gray-900">${e.judul}</h1>
        <p class="text-sm text-gray-500 mt-1">📅 ${formatDate(e.tanggal)}</p>
        </div>
        <div class="flex-shrink-0">
        <p class="text-3xl font-bold text-green-600">Rp${Number(e.harga).toLocaleString("id-ID")}</p>
        </div>
    </div>

    <div class="mt-6 space-y-4">
        <div class="text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">${e.deskripsi}</div>
        
        <div class="flex items-center text-sm text-gray-600">
        <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M17.657 16.657L13.414 12l4.243-4.243a6 6 0 10-8.485 8.485L12 13.414l-4.243 4.243a6 6 0 108.485-8.485z" />
        </svg>
        ${e.lokasi}
        </div>
    </div>

    <div id="actionBtns" class="mt-8 flex gap-3 flex-wrap"></div>
    `;

    if (token) {
      const actions = document.getElementById("actionBtns");

      // Edit
      const edit = document.createElement("a");
      edit.href = `event_edit.html?id=${eventId}`;
      edit.textContent = "✏️ Edit";
      edit.className = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition";
      actions.appendChild(edit);

      // Delete
      const del = document.createElement("button");
      del.textContent = "🗑️ Hapus";
      del.className = "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition";
      del.addEventListener("click", async () => {
        if (!confirm(`Yakin ingin menghapus "${e.judul}"?`)) return;
        try {
          const r2 = await fetch(`${BASE_HOST}${PROTECTED_ENDPOINTS.EVENT}/${eventId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
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
