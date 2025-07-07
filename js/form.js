
export function inicializarFormularioUsuarios() {
    console.log("Formulario de usuarios inicializado correctamente");

    fetch(`http://localhost:3000/users`)
        .then(response => response.json())
        .then(data => {
            console.log("Get data:", data);
            print_users(data); 
        });

    function print_users(users) {
        let users_container = document.getElementById('userTableBody');
        if (!users_container) {
            console.error("userTableBody no encontrado en DOM");
            return;
        }
        users_container.innerHTML = '';

        users.forEach(user => {
            users_container.innerHTML += `<tr id="${user.id}">
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.extensionPhone}</td>
                <td>${user.phone}</td>
                <td>${user.enrollNumber}</td>
                <td>${user.dateOfAdmission}</td>
                <td>
                    <button type="button" value="edit">Edit</button>
                    <button type="button" value="delet">Delet</button>
                </td>
            </tr>`;
        });
    }

    document.getElementById('userTableBody').addEventListener('click', function(event) {
        event.preventDefault();
        if (event.target.tagName !== 'BUTTON') return;

        const tr = event.target.closest('tr');
        const id = tr.id;
        const action = event.target.value;

        if (action === 'delet') {
            fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' })
                .then(() => tr.remove());
        } else if (action === 'edit') {
            edit_user(id);
        } else if (action === 'save-user') {
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
                    location.reload();
                } else {
                    console.error("Error al actualizar el usuario");
                }
            }).catch(err => console.error(err));
        } else if (action === 'cancel') {
            location.reload();
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
                nameInput.addEventListener('input', () => {
                    nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, '');
                });
            })
            .catch(err => console.error(err));
    }
}
