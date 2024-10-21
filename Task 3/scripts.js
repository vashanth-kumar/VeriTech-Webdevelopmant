document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const taskModal = document.getElementById('task-modal');
    const fullTaskText = document.getElementById('full-task-text');
    const closeButton = document.querySelector('.close-button');
    const modalCompleteButton = document.getElementById('modal-complete-button');
    const modalEditButton = document.getElementById('modal-edit-button');
    const modalDeleteButton = document.getElementById('modal-delete-button');

    let currentTaskIndex = null;
    let saveButton = null; // Reference to the save button

    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.classList.toggle('completed', task.completed);

            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text.length > 20 ? task.text.slice(0, 20) + '...' : task.text;
            taskText.onclick = () => showFullTask(index);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'actions';

            const completeButton = document.createElement('button');
            completeButton.innerHTML = task.completed ? 'Undo' : 'Complete';
            completeButton.onclick = () => toggleTask(index);

            const editButton = document.createElement('button');
            editButton.innerHTML = 'Edit';
            editButton.onclick = () => editTask(index);

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'Delete';
            deleteButton.onclick = () => deleteTask(index);

            if (task.completed) {
                editButton.style.display = 'none';
                deleteButton.style.display = 'none';
            }

            actionsDiv.appendChild(completeButton);
            actionsDiv.appendChild(editButton);
            actionsDiv.appendChild(deleteButton);

            li.appendChild(taskText);
            li.appendChild(actionsDiv);

            taskList.appendChild(li);
        });
    };

    const addTask = (text) => {
        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
    };

    const toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
        if (index === currentTaskIndex) {
            fullTaskText.classList.toggle('completed', tasks[index].completed);
            if (tasks[index].completed) {
                // Hide edit and delete buttons when task is completed
                modalEditButton.style.display = 'none';
                modalDeleteButton.style.display = 'none';
            } else {
                // Show edit and delete buttons when task is not completed
                modalEditButton.style.display = 'block';
                modalDeleteButton.style.display = 'block';
            }
        }
    };

    const editTask = (index) => {
        const task = tasks[index];
        fullTaskText.value = task.text;
        fullTaskText.removeAttribute('readonly'); // Allow editing
        currentTaskIndex = index;
        taskModal.style.display = 'flex';

        // Focus on the textarea for immediate editing
        fullTaskText.focus();

        // Hide other buttons and ensure only one save button is present
        modalCompleteButton.style.display = 'none';
        modalEditButton.style.display = 'none';
        modalDeleteButton.style.display = 'none';

        // Check if a save button already exists
        if (!saveButton) {
            // Create a new save button if it doesn't exist
            saveButton = document.createElement('button');
            saveButton.innerHTML = 'Save';
            saveButton.onclick = () => saveEditedTask(index);
            document.querySelector('.modal-actions').appendChild(saveButton);
        }
    };

    const saveEditedTask = (index) => {
        tasks[index].text = fullTaskText.value;
        fullTaskText.setAttribute('readonly', true); // Disable editing
        saveTasks();
        renderTasks();
        closeModal();
    };

    const deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        if (index === currentTaskIndex) {
            closeModal();
        }
    };

    const showFullTask = (index) => {
        currentTaskIndex = index;
        fullTaskText.value = tasks[index].text;
        fullTaskText.classList.toggle('completed', tasks[index].completed);
        taskModal.style.display = 'flex';
    };

    const closeModal = () => {
        taskModal.style.display = 'none';
        currentTaskIndex = null;
        // Remove the save button if it exists
        if (saveButton) {
            saveButton.remove();
            saveButton = null; // Reset the reference
        }
        // Show other buttons when closing the modal
        modalCompleteButton.style.display = 'block';
        modalEditButton.style.display = 'block';
        modalDeleteButton.style.display = 'block';
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text !== '') {
            addTask(text);
            taskInput.value = '';
        }
    });

    closeButton.addEventListener('click', closeModal);

    modalCompleteButton.addEventListener('click', () => {
        if (currentTaskIndex !== null) {
            toggleTask(currentTaskIndex);
        }
    });

    modalEditButton.addEventListener('click', () => {
        if (currentTaskIndex !== null) {
            editTask(currentTaskIndex);
        }
    });

    modalDeleteButton.addEventListener('click', () => {
        if (currentTaskIndex !== null) {
            deleteTask(currentTaskIndex);
        }
    });

    window.onclick = (event) => {
        if (event.target === taskModal) {
            closeModal();
        }
    };

    // Initial render
    renderTasks();
});
