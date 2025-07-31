// js/controller/login.js
import { BASE_HOST, ENDPOINTS } from "../template/url.js";

const form = document.getElementById('loginForm');
const errorEl = document.getElementById('errorMessage');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  errorEl.textContent = "";

  const body = { email, password };

  try {
    const res = await fetch(BASE_HOST + ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const result = await res.json();

    if (!res.ok) {
      if (result.error === "Invalid credentials") {
        alert("Email/Password salah");
      } else {
        errorEl.textContent = result.error || "Login gagal.";
      }
    } else {
      document.cookie = `token=${result.token}; path=/; max-age=86400`;

      alert("Login berhasil!");
      window.location.href = "/";
    }
  } catch (err) {
    errorEl.textContent = "Gagal menghubungi server.";
    console.error("Fetch Error:", err);
  }
});
