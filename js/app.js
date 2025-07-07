// js/app.js

// Función para cargar un fragmento HTML dentro del div#content
function loadContent(url) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      document.getElementById('content').innerHTML = html;
      if(url === 'users.html') {
        // Aquí llama la función que carga los usuarios y maneja eventos
        loadUsers();
      }
      // Podrías cargar otros scripts para otras secciones si tienes
    })
    .catch(err => console.error('Error cargando contenido:', err));
}

// Función que carga los usuarios y pinta la tabla
function loadUsers() {
  fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(users => {
      print_users(users);
      setupTableListeners();
    })
    .catch(err => console.error('Error al cargar usuarios:', err));
}

function print_users(users) {
  const tbody = document.getElementById('userTableBody');
  tbody.innerHTML = '';
  users.forEach(user => {
    tbody.innerHTML += `
      <tr id="${user.id}">
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.extensionPhone}</td>
        <td>${user.phone}</td>
        <td>${user.enrollNumber}</td>
        <td>${user.dateOfAdmission}</td>
        <td>
          <button type="button" value="edit">Edit</button>
          <button type="button" value="delete">Delete</button>
        </td>
      </tr>
    `;
  });
}

function setupTableListeners() {
  const tbody = document.getElementById('userTableBody');
  tbody.addEventListener('click', event => {
    if(event.target.tagName !== 'BUTTON') return;
    event.preventDefault();
    const tr = event.target.closest('tr');
    const id = tr.id;
    const action = event.target.value;

    if(action === 'delete') {
      fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' })
        .then(() => tr.remove());
    } else if(action === 'edit') {
      // tu función editar...
      edit_user(id);
    }
    // Más acciones...
  });
}

// Carga la tabla al inicio
document.addEventListener('DOMContentLoaded', () => {
  loadContent('users.html');
});

// Aquí podrías agregar más navegación SPA, por ejemplo:
document.getElementById('navUsers').addEventListener('click', e => {
  e.preventDefault();
  loadContent('users.html');
  document.getElementById('pageTitle').textContent = 'Panel de Usuarios';
});

document.getElementById('navSettings').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('content').innerHTML = '<p>Configuración no implementada todavía</p>';
  document.getElementById('pageTitle').textContent = 'Configuración';
});
