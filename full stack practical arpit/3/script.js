const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Function to create and append a new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  // Create list item
  const li = document.createElement('li');

  // Left side: Checkbox + Task Text
  const taskContent = document.createElement('div');
  taskContent.className = 'task-content';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.addEventListener('change', () => {
    li.classList.toggle('completed', checkbox.checked);
  });

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = taskText;

  taskContent.appendChild(checkbox);
  taskContent.appendChild(span);

  // Right side: Action Buttons (Up, Down, Delete)
  const actions = document.createElement('div');
  actions.className = 'actions';

  const upBtn = document.createElement('button');
  upBtn.textContent = '↑';
  upBtn.className = 'up-btn';
  upBtn.title = 'Move Up';
  upBtn.addEventListener('click', () => {
    if (li.previousElementSibling) {
      taskList.insertBefore(li, li.previousElementSibling);
    }
  });

  const downBtn = document.createElement('button');
  downBtn.textContent = '↓';
  downBtn.className = 'down-btn';
  downBtn.title = 'Move Down';
  downBtn.addEventListener('click', () => {
    if (li.nextElementSibling) {
      taskList.insertBefore(li.nextElementSibling, li);
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✕';
  deleteBtn.className = 'delete-btn';
  deleteBtn.title = 'Delete Task';
  deleteBtn.addEventListener('click', () => {
    li.remove();
  });

  actions.appendChild(upBtn);
  actions.appendChild(downBtn);
  actions.appendChild(deleteBtn);

  // Assemble and add to DOM
  li.appendChild(taskContent);
  li.appendChild(actions);
  taskList.appendChild(li);

  // Clear and refocus input
  taskInput.value = '';
  taskInput.focus();
}

// Event Listeners for adding tasks
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});
