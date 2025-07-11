import { get, get_id, deletes, update, post } from "./api.js";

const url = "http://localhost:3000/courses";

export async function loadCourses() {
  const courses = await get(url);
  printCourses(courses);
  setupUserTableListener();
}

loadCourses(); // 👈 ejecuta la función

function printCourses(courses) {
  let coursesContainer = document.getElementById("coursesTableBody");
  coursesContainer.innerHTML = "";
  const currentUser = JSON.parse(localStorage.getItem("user"));
  courses.forEach((course) => {
    coursesContainer.innerHTML += `
        <tr id="${course.id}">
            <td>${course.id}</td>
            <td>${course.title}</td>
            <td>${course.description}</td>
            <td>${course.startDate}</td>
            <td>${course.duration}</td>
            <td>
            ${
              currentUser && currentUser.admin
                ? `<button type="button" value="edit">Editar</button>
                    <button type="button" value="delete">Eliminar</button>`
                : `<button type="button" value="enroll">Inscribirse</button>`
            }
            </td>
        </tr>`;
  });
}

// Hear the event submit (button) of the form
function setupUserTableListener() {
  const tbody = document.getElementById("coursesTableBody");

  // Evita múltiples escuchas: clona el nodo y lo reemplaza (elimina listeners)
  const newTbody = tbody.cloneNode(true);
  tbody.parentNode.replaceChild(newTbody, tbody);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (currentUser && currentUser.admin) {
    newTbody.addEventListener("click", async function (event) {
      event.preventDefault();
      if (event.target.tagName !== "BUTTON") return;
      const tr = event.target.closest("tr");
      const id = tr.id;
      const action = event.target.value;
      if (action === "delete") {
        await deletes(url, id);
        location.reload();
      } else if (action === "edit") {
        edit_course(id);
      } else if (action === "save-course") {
        const inputs = tr.querySelectorAll("input");
        const existingCourse = await get_id(url, id);
        const updatedCourse = {
          ...existingCourse,
          title: inputs[0].value,
          description: inputs[1].value,
          startDate: inputs[2].value,
          duration: inputs[3].value,
        };
        await update(url, id, updatedCourse);
        location.reload();
      } else {
        location.reload();
      }
    });
  } else {
    newTbody.addEventListener("click", async function (event) {
      event.preventDefault();
      if (event.target.tagName !== "BUTTON") return;
      const tr = event.target.closest("tr");
      const id = tr.id;
      const action = event.target.value;
      if (action === "enroll") {
        await add_course(id, currentUser);
      }
    });
  }
}

async function edit_course(id) {
  const courseContainer = document.getElementById(id);
  const course = await get_id(url, id);

  courseContainer.innerHTML = `
    <td>${id}</td>
    <td><input type="text" value="${course.title}" required /></td>
    <td><input type="text" value="${course.description}" required /></td>
    <td><input type="date" value="${course.startDate}" required /></td>
    <td><input type="text" value="${course.duration}" required /></td>
    <td>
      <button type="button" value="save-course">Guardar</button>
      <button type="button" value="cancel">Cancelar</button>
    </td>`;
}

async function add_course(id, currentUser) {
  const currentUserId = currentUser.id;

  const enrolls = await get("http://localhost:3000/enrollments");
  const found = enrolls.find(
    (enrolls) => enrolls.courseId === id && enrolls.userId === currentUserId
  );

  if (found) {
    alert("Ya estás inscrito en este curso.");
    return;
  } else {
    try {
      const enroll = {
        userId: currentUserId,
        courseId: id,
      };
      await post("http://localhost:3000/enrollments", enroll);
      alert("Curso agregado correctamente");
    } catch (error) {
      console.error("Error al agregar el curso:", error);
    }
  }
}
