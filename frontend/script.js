const API_URL = 'http://localhost:3000/users';

const userForm = document.getElementById('userForm');
const userIdInput = document.getElementById('userId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const submitButton = document.getElementById('submitButton');
const formTitle = document.getElementById('form-title');
const cancelEditButton = document.getElementById('cancelEditButton');
const userTableBody = document.getElementById('userTableBody');

// Fetch and display users
async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Error al cargar usuarios.');
    }
}

// Render users in the table
function renderUsers(users) {
    userTableBody.innerHTML = '';
    users.forEach(user => {
        const row = userTableBody.insertRow();
        row.insertCell(0).textContent = user.id;
        row.insertCell(1).textContent = user.name;
        row.insertCell(2).textContent = user.email;
        const actionsCell = row.insertCell(3);

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = () => editUser(user);
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'delete';
        deleteButton.onclick = () => deleteUser(user.id);
        actionsCell.appendChild(deleteButton);
    });
}

// Handle form submission (Create/Update)
userForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = userIdInput.value;
    const name = nameInput.value;
    const email = emailInput.value;

    const userData = { name, email };

    try {
        let response;
        if (id) { // Update existing user
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
        } else { // Create new user
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
        }

        if (response.ok) {
            userForm.reset();
            userIdInput.value = '';
            submitButton.textContent = 'Crear Usuario';
            formTitle.textContent = 'Crear';
            cancelEditButton.style.display = 'none';
            fetchUsers();
        } else {
            const errorText = await response.text();
            alert(`Error al guardar usuario: ${errorText}`);
        }
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Error de conexión al guardar usuario.');
    }
});

// Populate form for editing
function editUser(user) {
    userIdInput.value = user.id;
    nameInput.value = user.name;
    emailInput.value = user.email;
    submitButton.textContent = 'Actualizar Usuario';
    formTitle.textContent = 'Editar';
    cancelEditButton.style.display = 'inline-block';
}

// Cancel edit mode
cancelEditButton.addEventListener('click', () => {
    userForm.reset();
    userIdInput.value = '';
    submitButton.textContent = 'Crear Usuario';
    formTitle.textContent = 'Crear';
    cancelEditButton.style.display = 'none';
});

// Delete user
async function deleteUser(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            fetchUsers();
        } else {
            const errorText = await response.text();
            alert(`Error al eliminar usuario: ${errorText}`);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error de conexión al eliminar usuario.');
    }
}

// Initial fetch on page load
fetchUsers();
