import { BASE_HOST, ENDPOINTS } from "../template/url.js";

const form = document.getElementById('registerForm');
const errorEl = document.getElementById('errorMessage');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nama = document.getElementById('nama').value.trim();
  const email = document.getElementById('email').value.trim();
  const telfon = document.getElementById('telfon').value.trim();
  const alamat = document.getElementById('alamat').value.trim();
  const password = document.getElementById('password').value;

  errorEl.textContent = "";

  const body = {
    nama,
    email,
    telfon,
    alamat,
    password
  };

  try {
    const res = await fetch(BASE_HOST + ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const result = await res.json();

    if (!res.ok) {
      errorEl.textContent = result.error || "Terjadi kesalahan saat mendaftar.";
    } else {
      alert("Pendaftaran berhasil!");
      form.reset();
      window.location.href = "/login.html";
    }
  } catch (err) {
    errorEl.textContent = "Gagal menghubungi server.";
    console.error("Fetch Error:", err);
  }
});
