import {get, get_id, deletes, update} from "./api.js";

const url= "http://localhost:3000/users"

export async function loadUsers() {
  const users = await get(url);
  print_users(users);
  setupUserTableListener()
}

loadUsers(); // 👈 ejecuta la función


function print_users(users) {
    let users_container = document.getElementById('userTableBody');
    users_container.innerHTML = ''; // Clear the previous tasks

    users.forEach(users => {
        users_container.innerHTML += `<tr id="${users.id}">
            <td>${users.id}</td>
            <td>${users.name}</td>
            <td>${users.email}</td>
            <td>${users.extensionPhone}</td>
            <td>${users.phone}</td>
            <td>${users.enrollNumber}</td>
            <td>${users.dateOfAdmission}</td>
            <td>${users.admin ? "Sí" : "No"}</td>
            <td>${users.pasword}</td>
            <td><button type="button" value="edit">Edit</button>
            <button type="button" value="delet">Delet</button></td>
        </tr>`
    });
}



// Hear the event submit (button) of the form 
function setupUserTableListener() {
  document.getElementById("userTableBody").addEventListener("click", async function (event) {
    event.preventDefault();

    if (event.target.tagName !== 'BUTTON') return;

    const tr = event.target.closest('tr');
    const id = tr.id;
    const action = event.target.value;

    if (action === 'delet') {
      await deletes(url, id);
      location.reload();
    } else if (action === 'edit') {
      edit_user(id);
    } else if (action === 'save-user') {
      const inputs = tr.querySelectorAll('input');

      // 🟡 Paso 1: Traer el usuario original para conservar campos que no se muestran
      const existingUser = await get_id(url, id);

      // 🟢 Paso 2: Mezclar los valores modificados
      const updatedUser = {
        ...existingUser,
        name: inputs[0].value,
        email: inputs[1].value,
        extensionPhone: inputs[2].value,
        phone: inputs[3].value,
        enrollNumber: inputs[4].value,
        dateOfAdmission: inputs[5].value,
        pasword: inputs[6].value,
        admin: select.value === "true"
      };
      console.log("Actualizando con:", updatedUser);
      await update(url, id, updatedUser);
      location.reload();
    }

  });
}

async function edit_user(id) {
  const user_container = document.getElementById(id);
  const user = await get_id(url, id);
  user_container.innerHTML = `
    <td>${id}</td>
    <td><input type="text" value="${user.name}" required /></td>
    <td><input type="email" value="${user.email}" required /></td>
    <td><input type="text" value="${user.extensionPhone}" required /></td>
    <td><input type="number" value="${user.phone}" required /></td>
    <td><input type="number" value="${user.enrollNumber}" required /></td>
    <td><input type="date" value="${user.dateOfAdmission}" required /></td>
    <td>
      <select required>
        <option value="true" ${user.admin ? "selected" : ""}>Sí</option>
        <option value="false" ${!user.admin ? "selected" : ""}>No</option>
      </select>
    </td>
    <td><input type="text" value="${user.pasword}" required/></td>
      <br/>
      <button type="button" value="save-user">Guardar</button>
      <button type="button" value="cancel">Cancelar</button>
    </td>`;



  const nameInput = user_container.querySelector('input[type="text"]');
  nameInput.addEventListener('input', () => {
    nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, '');
  });
}
