import { get, get_id, deletes, update } from "./api.js";

const url = "http://localhost:3000/users";

export async function loadUsers() {
  const users = await get(url);
  print_users(users);
  setupUserTableListener();
}

loadUsers(); // 👈 ejecuta la función

function print_users(users) {
  let users_container = document.getElementById("userTableBody");
  users_container.innerHTML = "";
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = currentUser && currentUser.admin;
  users.forEach((user) => {
    users_container.innerHTML += `
        <tr id="${user.id}">
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.extensionPhone}</td>
            <td>${user.phone}</td>
            <td>${user.enrollNumber}</td>
            <td>${user.dateOfAdmission}</td>
            <td>${user.admin ? "Sí" : "No"}</td>
            <td>${
              isAdmin? 
              user.pasword
              : `<input type="password" value="${user.pasword}" readonly style="border: none; background: transparent;" />`
            }</td>
            <td>${
              isAdmin? 
              `<button type="button" value="edit">Edit</button>
              <button type="button" value="delet">Delet</button>`
              : `<span style="color: gray;">Sin permisos</span>`
            }</td>
        </tr>`;
  });
}

// Hear the event submit (button) of the form
function setupUserTableListener() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  if (!currentUser || !currentUser.admin) return;

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
      const select = tr.querySelector('select');
      const existingUser = await get_id(url, id);
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
      await update(url, id, updatedUser);
      location.reload();
    } else {
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
  nameInput.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, "");
  });
}
