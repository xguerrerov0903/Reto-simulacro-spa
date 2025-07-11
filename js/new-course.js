import { post } from "./api.js"; // Asegúrate que tienes esta función

const url = "http://localhost:3000/courses";

document
  .getElementById("newCourseForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const user = Object.fromEntries(formData.entries());

    try {
      await post(url, user);
      alert("Curso creado correctamente");
      this.reset(); // Limpiar el formulario
    } catch (error) {
      console.error("Error al crear el curso:", error);
    }
  });
