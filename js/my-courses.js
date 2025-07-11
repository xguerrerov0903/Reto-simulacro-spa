import { get, get_id, deletes, update, post } from "./api.js";

const url = "http://localhost:3000/courses";
const urlEnroll = "http://localhost:3000/enrollments";

export async function loadMyCourses() {
  const courses = await get(url);
  const enrolls = await get(urlEnroll);
  printMyCourses(courses, enrolls);
  setupUserTableListener();
}

loadMyCourses(); // 👈 ejecuta la función

function printMyCourses(courses, enrolls) {
  let myCoursesContainer = document.getElementById("myCoursesTableBody");
  myCoursesContainer.innerHTML = "";
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Filtrar las inscripciones del usuario actual
  const myEnrollments = enrolls.filter((enroll) => enroll.userId == currentUser.id);

  // Recorremos las inscripciones, no los cursos directamente
  myEnrollments.forEach((enroll) => {
    const course = courses.find((c) => c.id == enroll.courseId);
    if (course) {
      myCoursesContainer.innerHTML += `
        <tr id="${enroll.id}"> <!-- Usamos el ID de la inscripción -->
          <td>${course.id}</td>
          <td>${course.title}</td>
          <td>${course.description}</td>
          <td>${course.startDate}</td>
          <td>${course.duration}</td>
          <td><button type="button" value="delete">Eliminar</button></td>
        </tr>`;
    }
  });
}


// Hear the event submit (button) of the form
function setupUserTableListener() {
  const tbody = document.getElementById("myCoursesTableBody");

  // Evita múltiples escuchas: clona el nodo y lo reemplaza (elimina listeners)
  const newTbody = tbody.cloneNode(true);
  tbody.parentNode.replaceChild(newTbody, tbody);

  newTbody.addEventListener("click", async function (event) {
    event.preventDefault();
    if (event.target.tagName !== "BUTTON") return;
    const tr = event.target.closest("tr");
    const id = tr.id;
    const action = event.target.value;
    if (action === "delete") {
      await deletes(url, id);
      alert("Curso eliminado");
      location.reload();
    } 
  });
}


