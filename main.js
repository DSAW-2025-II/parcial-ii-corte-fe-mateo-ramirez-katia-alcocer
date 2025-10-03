const BACKEND_URL = "https://parcial-ii-corte-be-mateo-ramirez-katia.onrender.com";
const ENV_EMAIL = "admin@admin.com";
const ENV_PASSWORD = "admin";
const loginBtn = document.getElementById("loginBtn");
const loginStatus = document.getElementById("loginStatus");
const searchSection = document.getElementById("searchSection");
const searchBtn = document.getElementById("searchBtn");
const pokemonNameInput = document.getElementById("pokemonName");
const resultDiv = document.getElementById("result");
 
loginBtn.onclick = async function() {
  loginStatus.textContent = "Iniciando sesión...";
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth`, {
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
 
searchBtn.onclick = async function() {
  const name = pokemonNameInput.value.trim();
  resultDiv.innerHTML = "";
  if (!name) {
    resultDiv.textContent = "Escribe el nombre de un Pokémon.";
    return;
  }
  const token = localStorage.getItem("sessionToken");
  if (!token) {
    resultDiv.textContent = "No estás autenticado.";
    return;
  }
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/pokemonDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ pokemonName: name })
    });
    const data = await res.json();
    if (res.status === 200 && data.name) {
      resultDiv.innerHTML = `
        <h2>${data.name}</h2>
        <p><strong>Especie:</strong> ${data.species}</p>
        <p><strong>Peso:</strong> ${data.weight}</p>
        <img src="${data.img_url}" alt="${data.name}" />
      `;
    } else if (res.status === 400 && data.name === "") {
      resultDiv.innerHTML = `<span class="error">Ups! Pokémon no encontrado</span>`;
    } else {
      resultDiv.innerHTML = `<span class="error">Error al buscar Pokémon.</span>`;
    }
  } catch {
    resultDiv.innerHTML = `<span class="error">Error de conexión al backend.</span>`;
  }
};
 
 
if (localStorage.getItem("sessionToken")) {
  loginBtn.style.display = "none";
  searchSection.style.display = "block";
  loginStatus.textContent = "Ya tienes sesión activa.";
}