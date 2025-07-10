import { post } from "./api.js"; // Asegúrate que tienes esta función

const url = "http://localhost:3000/users";

document
  .getElementById("newUserForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const user = Object.fromEntries(formData.entries());

    try {
      await post(url, user);
      alert("Usuario creado correctamente");
      this.reset(); // Limpiar el formulario
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  });
