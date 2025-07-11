
import { get, post, deletes, update, get_id } from "./api.js";
const url = "http://localhost:3000/courses";
const enrollmentsUrl = "http://localhost:3000/enrollments";
const currentUser = JSON.parse(localStorage.getItem("user"));

async function loadCourses() {
  const courses = await get(url);
  renderCourses(courses);
}

function renderCourses(courses) {
  const container = document.getElementById("coursesTableBody");
  container.innerHTML = "";
  courses.forEach(course => {
    container.innerHTML += \`
    <tr id="\${course.id}">
      <td>\${course.id}</td>
      <td>\${course.title}</td>
      <td>\${course.description}</td>
      <td>\${course.startDate}</td>
      <td>\${course.duration}</td>
      <td>
        \${currentUser && currentUser.role === "admin" ?
          \`<button type="button" value="edit">Editar</button>
            <button type="button" value="delete">Eliminar</button>\` :
          \`<button type="button" value="enroll">Inscribirse</button>\`}
      </td>
    </tr>\`;
  });
}

document.addEventListener("click", async (e) => {
  if (!e.target.closest("table")) return;
  const button = e.target;
  const tr = button.closest("tr");
  const id = tr.id;
  if (button.value === "delete") {
    await deletes(url, id);
    loadCourses();
  } else if (button.value === "edit") {
    const course = await get_id(url, id);
    tr.innerHTML = \`
    <td>\${id}</td>
    <td><input value="\${course.title}" /></td>
    <td><input value="\${course.description}" /></td>
    <td><input value="\${course.startDate}" type="date" /></td>
    <td><input value="\${course.duration}" /></td>
    <td><button type="button" value="save">Guardar</button></td>\`;
  } else if (button.value === "save") {
    const inputs = tr.querySelectorAll("input");
    const updated = {
      title: inputs[0].value,
      description: inputs[1].value,
      startDate: inputs[2].value,
      duration: inputs[3].value
    };
    await update(url, id, updated);
    loadCourses();
  } else if (button.value === "enroll") {
    if (!currentUser) {
      alert("Debes iniciar sesión para inscribirte.");
      return;
    }
    await post(enrollmentsUrl, { userId: currentUser.id, courseId: parseInt(id) });
    alert("Inscripción exitosa");
  }
});

loadCourses();
