const routes = {
  "/": "/users.html",
  "/users": "/users.html",
  "/new-users": "/new-users.html",
  "/new-course": "/new-course.html",
  "/my-courses": "/my-courses.html",
  "/courses": "/courses.html",
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

  const user = JSON.parse(localStorage.getItem("user"));

  if (pathname === "/" || pathname === "/users") {
    if (!user || !user.admin) {
      alert("Acceso restringido.");
      return navigate("/my-courses");
    }
    import("./js/form.js").then(module => {
      module.loadUsers();
    });
  }

  if (pathname === "/new-users") {
    if (!user || !user.admin) {
      alert("Solo los administradores pueden acceder a esta sección.");
      return navigate("/my-courses");
    }
    import("./js/new-user.js");
  }

  if (pathname === "/new-course") {
    if (!user || !user.admin) {
      alert("Solo los administradores pueden acceder a esta sección.");
      return navigate("/my-courses");
    }
    import("./js/new-course.js");
  }

  if (pathname === "/my-courses") {
    if (!user || user.admin) {
      alert("Solo los usuarios pueden acceder a esta sección.");
      return navigate("/users");
    }
    import("./js/my-courses.js");
  }

  if (pathname === "/courses") {
    import("./js/courses.js").then(module => {
      module.loadCourses();
    });
  }
}


window.addEventListener("popstate", () => navigate(location.pathname));

document.addEventListener("DOMContentLoaded", () => {
  navigate(location.pathname);
});

import "./js/login.js";