import { BASE_HOST, ENDPOINTS, PROTECTED_ENDPOINTS } from "../template/url.js";

const createBtn = document.getElementById("createBtn");
const loginBtn = document.getElementById("loginBtn");
const token = getCookieValue("token");

if (!token) {
  createBtn.classList.add("hidden");
  loginBtn.classList.remove("hidden");
}

const eventList = document.getElementById("eventList");
const errorEl = document.getElementById("errorMessage");

function formatTanggal(isoDate) {
  const options = { day: "numeric", month: "long", year: "numeric" };
  const date = new Date(isoDate);
  return date.toLocaleDateString("id-ID", options);
}

function getCookieValue(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

async function loadEvents() {
  try {
    const response = await fetch(BASE_HOST + ENDPOINTS.EVENT);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Gagal memuat data.");
    }

    const token = getCookieValue("token");

    result.data.forEach(event => {
      const link = document.createElement("a");
      link.href = `event_detail.html?id=${event.id}`;
      link.className = "block";

      const card = document.createElement("div");
      card.className = "relative bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition space-y-1";

      card.innerHTML = `
        <div class="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-1">
          ${event.kategori || "Lainnya"}
        </div>
        <h2 class="text-lg font-bold text-gray-800">${event.judul}</h2>
        <p class="text-base text-green-600 font-semibold">Rp${Number(event.harga).toLocaleString("id-ID")}</p>
        <p class="text-sm text-gray-600">${event.lokasi} • ${formatTanggal(event.tanggal)}</p>
      `;

      link.appendChild(card);

      // Append edit/delete buttons if authenticated
      if (token) {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕";
        deleteBtn.title = "Hapus Event";
        deleteBtn.className = "absolute top-2 right-2 text-xs text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1 rounded transition";
        deleteBtn.addEventListener("click", async (e) => {
          e.preventDefault(); // Prevent navigation
          const confirmDelete = confirm(`Yakin ingin menghapus event "${event.judul}"?`);
          if (!confirmDelete) return;

          try {
            const res = await fetch(`${BASE_HOST}${PROTECTED_ENDPOINTS.EVENT}/${event.id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            if (!res.ok) throw new Error("Gagal menghapus event.");
            link.remove();
          } catch (err) {
            alert("Terjadi kesalahan saat menghapus.");
            console.error("Delete error:", err);
          }
        });

        const editBtn = document.createElement("a");
        editBtn.textContent = "Edit";
        editBtn.title = "Edit Event";
        editBtn.href = `event_edit.html?id=${event.id}`;
        editBtn.className = "absolute bottom-2 right-2 text-xs text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded transition";

        card.appendChild(deleteBtn);
        card.appendChild(editBtn);
      }

      eventList.appendChild(link);
    });
  } catch (err) {
    errorEl.textContent = err.message;
    console.error("Fetch error:", err);
  }
}

loadEvents();
