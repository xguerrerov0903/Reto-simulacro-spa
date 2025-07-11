
const routes = {
  "/": "/users.html",
  "/users": "/users.html",
  "/new-users": "/new-users.html",
  "/courses": "/courses.html",
  "/my-courses": "/my-courses.html"
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

  if (pathname === "/" || pathname === "/users") {
    import("./js/form.js").then(module => module.loadUsers());
  } else if (pathname === "/new-users") {
    import("./js/new-user.js");
  } else if (pathname === "/courses") {
    import("./js/courses.js");
  } else if (pathname === "/my-courses") {
    import("./js/my-courses.js");
  }
}

window.addEventListener("popstate", () => navigate(location.pathname));
document.addEventListener("DOMContentLoaded", () => navigate(location.pathname));
