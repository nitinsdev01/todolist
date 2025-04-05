document.getElementById('addBtn').addEventListener('click', addTodo);
document.getElementById('deleteSelectedBtn').addEventListener('click', deleteSelectedTodos);
document.getElementById('cloneSelectedBtn').addEventListener('click', cloneSelectedTodos);
document.getElementById('selectAllBtn').addEventListener('click', toggleSelectAll);

let isAllSelected = false;

// Load saved todos when the page loads
document.addEventListener('DOMContentLoaded', loadTodos);

function saveTodos() {
  const todoList = document.getElementById('todoList');
  const todos = [];
  
  todoList.querySelectorAll('.list-group-item').forEach(item => {
    const checkbox = item.querySelector('.form-check-input');
    const span = item.querySelector('span');
    const timestamp = item.querySelector('.timestamp');
    
    todos.push({
      text: span.textContent,
      timestamp: timestamp.textContent,
      isChecked: checkbox.checked
    });
  });
  
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    const todos = JSON.parse(savedTodos);
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex flex-column';
      
      const mainContent = document.createElement('div');
      mainContent.className = 'd-flex justify-content-between align-items-center';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-check-input me-2';
      checkbox.checked = todo.isChecked;
      checkbox.addEventListener('change', () => {
        toggleSelectedButtons();
        saveTodos();
      });
      mainContent.appendChild(checkbox);
      
      const span = document.createElement('span');
      span.textContent = todo.text;
      mainContent.appendChild(span);

      const btnGroup = document.createElement('div');
      btnGroup.className = 'btn-group';

      const editBtn = document.createElement('button');
      editBtn.innerHTML = '<i class="bi bi-pencil-fill"></i>';
      editBtn.className = 'edit-btn btn btn-outline-secondary btn-sm';
      editBtn.addEventListener('click', () => editTodoItem(li, span));

      const cloneBtn = document.createElement('button');
      cloneBtn.innerHTML = '<i class="bi bi-files"></i>';
      cloneBtn.className = 'clone-btn btn btn-outline-secondary btn-sm';
      cloneBtn.addEventListener('click', () => cloneTodoItem(li));

      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
      deleteBtn.className = 'delete-btn btn btn-outline-danger btn-sm';
      deleteBtn.addEventListener('click', () => deleteTodoItem(li));

      btnGroup.appendChild(editBtn);
      btnGroup.appendChild(cloneBtn);
      btnGroup.appendChild(deleteBtn);
      mainContent.appendChild(btnGroup);

      const timestamp = document.createElement('div');
      timestamp.className = 'timestamp';
      timestamp.textContent = todo.timestamp;
      timestamp.style.textAlign = 'right';

      li.appendChild(mainContent);
      li.appendChild(timestamp);

      document.getElementById('todoList').appendChild(li);
    });
    toggleSelectedButtons();
  }
}

function toggleSelectAll() {
  const checkboxes = document.querySelectorAll('#todoList .form-check-input');
  const selectAllBtn = document.getElementById('selectAllBtn');
  
  isAllSelected = !isAllSelected;
  checkboxes.forEach(checkbox => {
    checkbox.checked = isAllSelected;
  });
  
  selectAllBtn.textContent = isAllSelected ? 'Deselect All' : 'Select All';
  selectAllBtn.classList.toggle('btn-secondary');
  selectAllBtn.classList.toggle('btn-primary');
  toggleSelectedButtons();
}

function addTodo() {
  const todoInput = document.getElementById('todoInput');
  const todoText = todoInput.value.trim();

  if (todoText === '') return;

  const li = document.createElement('li');
  li.className = 'list-group-item d-flex flex-column';
  
  const mainContent = document.createElement('div');
  mainContent.className = 'd-flex justify-content-between align-items-center';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'form-check-input me-2';
  checkbox.addEventListener('change', () => {
    toggleSelectedButtons();
    saveTodos();
  });
  mainContent.appendChild(checkbox);
  
  const span = document.createElement('span');
  span.textContent = todoText;
  mainContent.appendChild(span);

  const btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  const editBtn = document.createElement('button');
  editBtn.innerHTML = '<i class="bi bi-pencil-fill"></i>';
  editBtn.className = 'edit-btn btn btn-outline-secondary btn-sm';
  editBtn.addEventListener('click', () => editTodoItem(li, span));

  const cloneBtn = document.createElement('button');
  cloneBtn.innerHTML = '<i class="bi bi-files"></i>';
  cloneBtn.className = 'clone-btn btn btn-outline-secondary btn-sm';
  cloneBtn.addEventListener('click', () => cloneTodoItem(li));

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
  deleteBtn.className = 'delete-btn btn btn-outline-danger btn-sm';
  deleteBtn.addEventListener('click', () => deleteTodoItem(li));

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(cloneBtn);
  btnGroup.appendChild(deleteBtn);
  mainContent.appendChild(btnGroup);

  const timestamp = document.createElement('div');
  timestamp.className = 'timestamp';
  timestamp.textContent = new Date().toLocaleString();
  timestamp.style.textAlign = 'right';

  li.appendChild(mainContent);
  li.appendChild(timestamp);

  document.getElementById('todoList').appendChild(li);
  todoInput.value = '';
  toggleSelectedButtons();
  saveTodos();
}

function editTodoItem(li, span) {
  const newText = prompt('Edit your task', span.textContent);
  if (newText !== null) {
    span.textContent = newText.trim();
    saveTodos();
  }
}

function cloneTodoItem(li) {
  const clone = li.cloneNode(true);
  // Update the timestamp to current time
  const timestamp = clone.querySelector('.timestamp');
  timestamp.textContent = new Date().toLocaleString();
  
  // Reattach event listeners
  const span = clone.querySelector('span');
  clone.querySelector('.edit-btn').addEventListener('click', () => editTodoItem(clone, span));
  clone.querySelector('.clone-btn').addEventListener('click', () => cloneTodoItem(clone));
  clone.querySelector('.delete-btn').addEventListener('click', () => deleteTodoItem(clone));
  clone.querySelector('.form-check-input').addEventListener('change', () => {
    toggleSelectedButtons();
    saveTodos();
  });
  
  document.getElementById('todoList').appendChild(clone);
  toggleSelectedButtons();
  saveTodos();
}

function deleteTodoItem(li) {
  li.remove();
  toggleSelectedButtons();
  saveTodos();
}

function deleteSelectedTodos() {
  const checkboxes = document.querySelectorAll('#todoList .form-check-input');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      checkbox.closest('.list-group-item').remove();
    }
  });
  toggleSelectedButtons();
  saveTodos();
}

function cloneSelectedTodos() {
  const checkboxes = document.querySelectorAll('#todoList .form-check-input');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const li = checkbox.closest('.list-group-item');
      cloneTodoItem(li);
    }
  });
  toggleSelectedButtons();
}

function toggleSelectedButtons() {
  const checkboxes = document.querySelectorAll('#todoList .form-check-input');
  const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
  const cloneSelectedBtn = document.getElementById('cloneSelectedBtn');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
  const hasItems = checkboxes.length > 0;

  // Show/hide Select All button based on whether there are items
  selectAllBtn.style.display = hasItems ? 'inline-block' : 'none';
  
  // Show/hide other buttons based on selection
  if (anyChecked) {
    deleteSelectedBtn.style.display = 'inline-block';
    cloneSelectedBtn.style.display = 'inline-block';
  } else {
    deleteSelectedBtn.style.display = 'none';
    cloneSelectedBtn.style.display = 'none';
  }
}
