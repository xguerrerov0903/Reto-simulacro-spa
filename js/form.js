fetch(`http://localhost:3000/users`)
    // For defauylt the fetch method is GET, so we don't need to specify it
    .then(response => response.json())
    // The data that is GET will be print
    .then(data => {
        console.log("Get data:", data);
        print_users(data); 
    })
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
            <td><button type="button" value="edit">Edit</button>
            <button type="button" value="delet">Delet</button></td>
        </tr>`
    });
}

let listener_table = document.getElementById(`userTableBody`);

// Hear the event submit (button) of the form 
document.getElementById('userTableBody').addEventListener('click', function(event) {
  event.preventDefault();

  if (event.target.tagName !== 'BUTTON') return;

  const tr = event.target.closest('tr');
  const id = tr.id;
  const action = event.target.value;

  if (action === 'delet') {
    fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' })
      .then(() => tr.remove()); // Remueve la fila al eliminar
  } 
  else if (action === 'edit') {
    console.log("Reload?")
    edit_user(id);
  } 
  else if (action === 'save-user') {
    const inputs = tr.querySelectorAll('input');
    const updatedUser = {
      name: inputs[0].value,
      email: inputs[1].value,
      extensionPhone: inputs[2].value,
      phone: inputs[3].value,
      enrollNumber: inputs[4].value,
      dateOfAdmission: inputs[5].value
    };

    fetch(`http://localhost:3000/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    }).then(res => {
      if (res.ok) {
        tr.innerHTML = `
          <td>${id}</td>
          <td>${updatedUser.name}</td>
          <td>${updatedUser.email}</td>
          <td>${updatedUser.extensionPhone}</td>
          <td>${updatedUser.phone}</td>
          <td>${updatedUser.enrollNumber}</td>
          <td>${updatedUser.dateOfAdmission}</td>
          <td><button type="button" value="edit">Edit</button>
              <button type="button" value="delet">Delet</button></td>`;
        } else {
        console.error('Error actualizando usuario:', res.status);
        }
        })
        .catch(error => {
        console.error('Fetch PATCH falló:', error);
        });
  }
  else if (action === 'cancel') {
    // Para cancelar, puedes volver a imprimir la fila original desde el usuario o recargar solo esa fila
    fetch(`http://localhost:3000/users/${id}`)
      .then(res => res.json())
      .then(user => {
        tr.innerHTML = `
          <td>${id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.extensionPhone}</td>
          <td>${user.phone}</td>
          <td>${user.enrollNumber}</td>
          <td>${user.dateOfAdmission}</td>
          <td><button type="button" value="edit">Edit</button>
              <button type="button" value="delet">Delet</button></td>`;
      });
  }
});



function edit_user(id) {
  const user_container = document.getElementById(id);

  fetch(`http://localhost:3000/users/${id}`)
    .then(response => {
      if (!response.ok) throw new Error("Usuario no encontrado");
      return response.json();
    })
    .then(user => {
      user_container.innerHTML = `
        <td>${id}</td>
        <td><input type="text" value="${user.name}" required /></td>
        <td><input type="email" value="${user.email}" required /></td>
        <td><input type="text" value="${user.extensionPhone}" required /></td>
        <td><input type="number" value="${user.phone}" required /></td>
        <td><input type="number" value="${user.enrollNumber}" required /></td>
        <td><input type="date" value="${user.dateOfAdmission}" required /></td>
        <td>
          <button type="button" value="save-user">Guardar</button>
          <button type="button" value="cancel">Cancelar</button>
        </td>`;

        const nameInput = user_container.querySelector('input[type="text"]');

        // Agregar un listen a este campo en un caso un input que estara atento a lo que sa tipea
        nameInput.addEventListener('input', () => {
        // Este listen cada que haya una entreda o modificacion en este input revisara que sea un caracter alfabertico o un espacio y de no serlo lo elimina
        nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, '');
        });
    })
    .catch(err => console.error(err));
}
