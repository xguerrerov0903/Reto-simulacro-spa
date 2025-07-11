
import { get, deletes } from "./api.js";
const enrollmentsUrl = "http://localhost:3000/enrollments";
const coursesUrl = "http://localhost:3000/courses";
const currentUser = JSON.parse(localStorage.getItem("user"));

async function loadMyCourses() {
  if (!currentUser) return;
  const enrollments = await get(\`\${enrollmentsUrl}?userId=\${currentUser.id}\`);
  const container = document.getElementById("myCoursesTableBody");
  container.innerHTML = "";
  for (const enrollment of enrollments) {
    const course = await get(\`\${coursesUrl}/\${enrollment.courseId}\`);
    container.innerHTML += \`
    <tr id="\${enrollment.id}">
      <td>\${course.id}</td>
      <td>\${course.title}</td>
      <td>\${course.description}</td>
      <td>\${course.startDate}</td>
      <td>\${course.duration}</td>
      <td><button type="button" value="cancel">Cancelar Inscripción</button></td>
    </tr>\`;
  }
}

document.addEventListener("click", async (e) => {
  if (!e.target.closest("table")) return;
  if (e.target.value === "cancel") {
    const tr = e.target.closest("tr");
    const enrollmentId = tr.id;
    await deletes(enrollmentsUrl, enrollmentId);
    loadMyCourses();
  }
});

loadMyCourses();
