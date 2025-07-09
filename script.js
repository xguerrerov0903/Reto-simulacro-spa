const routes = {
  "/": "/users.html",
  "/users": "/users.html",
  "/new-users": "/new-users.html",
};


document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  }
});

async function navigate(pathname) {
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);

  // 🚩 Ejecutar tu inicializador aquí después de cargar la vista
  if (pathname === "/" || pathname === "/users") {
    import("./js/form.js").then(module => {
      module.loadUsers(); // Llama a tu función de inicialización
    });
  }

  if (pathname === "/new-users") {
    import("./js/new-user.js").then(module => {
      module.loadUsers(); // Llama a tu función de inicialización
    });
  }
}


window.addEventListener("popstate", () =>
  navigate(location.pathname)
);

navigate(location.pathname);