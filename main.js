const ENV_EMAIL = "admin@admin.com";
const ENV_PASSWORD = "admin";
const loginBtn = document.getElementById("loginBtn");
const loginStatus = document.getElementById("loginStatus");
const searchSection = document.getElementById("searchSection");

loginBtn.onclick = async function() {
  loginStatus.textContent = "Iniciando sesión...";
  try {
    const res = await fetch("https://parcial-ii-corte-be-mateo-ramirez-katia.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ENV_EMAIL, password: ENV_PASSWORD })
    });
    const data = await res.json();
    if (res.status === 200 && data.token) {
      localStorage.setItem("sessionToken", data.token);
      loginStatus.textContent = "Login exitoso.";
      searchSection.style.display = "block";
      loginBtn.style.display = "none";
    } else {
      loginStatus.textContent = "Error al iniciar sesión.";
    }
  } catch {
    loginStatus.textContent = "Error de conexión al backend.";
  }
};
