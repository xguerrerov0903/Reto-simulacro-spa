import { get } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginDiv = document.querySelector(".login");
  const containerDiv = document.querySelector(".container");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser) {
    loginDiv.style.display = "none";
    containerDiv.style.display = "flex";
    mostrarNombreUsuario(storedUser);
    controlarPermisos(storedUser);
  } else {
    loginDiv.style.display = "flex";
    containerDiv.style.display = "none";
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    // Aqui invoque la funcion handleLogin cuando el evento submit es escuchado ademas de ser enviado con el
    loginForm.addEventListener("submit", handleLogin);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
});

// El evento enviado es el submit del form
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const users = await get(
      `http://localhost:3000/users?email=${email}&pasword=${password}`
    );
    if (users.length > 0) {
      const user = users[0];
      localStorage.setItem("user", JSON.stringify(user));
      document.querySelector(".login").style.display = "none";
      document.querySelector(".container").style.display = "flex";
      mostrarNombreUsuario(user);
      controlarPermisos(user);
      location.reload();
    } else {
      document.getElementById("loginError").style.display = "block";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("loginError").textContent = "Error en el servidor";
    document.getElementById("loginError").style.display = "block";
  }
}

function mostrarNombreUsuario(user) {
  const adminInfo = document.querySelector(".admin-name");
  if (adminInfo) adminInfo.textContent = user.name;
}

function controlarPermisos(user) {
  const newUsersLink = document.querySelector('a[href="/new-users"]');
  if (!user.admin && newUsersLink) {
    newUsersLink.style.display = "none";
  }
}

function handleLogout() {
  localStorage.removeItem("user");
  location.reload();
}
