// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/todolist/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

document.getElementById('addBtn').addEventListener('click', addTodo);
document.getElementById('deleteSelectedBtn').addEventListener('click', deleteSelectedTodos);
document.getElementById('cloneSelectedBtn').addEventListener('click', cloneSelectedTodos);
document.getElementById('selectAllBtn').addEventListener('click', toggleSelectAll);

let isAllSelected = false;

// Load saved todos when the page loads
document.addEventListener('DOMContentLoaded', loadTodos);

function saveTodos() {
  const todos = [];
  document.querySelectorAll('#todoList .list-group-item').forEach(item => {
    const checkbox = item.querySelector('.form-check-input');
    const taskText = item.querySelector('.task-text');
    const timestamp = item.querySelector('.timestamp');
    
    todos.push({
      text: taskText.textContent,
      completed: checkbox.checked,
      timestamp: timestamp.textContent
    });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex flex-column';
    
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      toggleSelectedButtons();
      saveTodos();
      updateStatusText();
    });
    taskContent.appendChild(checkbox);
    
    const taskText = document.createElement('p');
    taskText.className = 'task-text';
    taskText.textContent = todo.text;
    taskText.addEventListener('click', () => {
      taskText.classList.toggle('expanded');
    });
    taskContent.appendChild(taskText);
    
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
    editBtn.addEventListener('click', () => editTodo(li, taskText));
    taskActions.appendChild(editBtn);
    
    const cloneBtn = document.createElement('button');
    cloneBtn.className = 'clone-btn';
    cloneBtn.innerHTML = '<i class="bi bi-files"></i>';
    cloneBtn.addEventListener('click', () => cloneTodo(li));
    taskActions.appendChild(cloneBtn);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    deleteBtn.addEventListener('click', () => deleteTodo(li));
    taskActions.appendChild(deleteBtn);
    
    taskContent.appendChild(taskActions);
    li.appendChild(taskContent);
    
    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    timestamp.textContent = todo.timestamp;
    li.appendChild(timestamp);
    
    document.getElementById('todoList').appendChild(li);
  });
  
  toggleSelectedButtons();
  updateStatusText();
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
  updateStatusText();
}

function addTodo() {
  const todoInput = document.getElementById('todoInput');
  const todoText = todoInput.value.trim();
  
  if (todoText === '') return;
  
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex flex-column';
  
  const taskContent = document.createElement('div');
  taskContent.className = 'task-content';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'form-check-input';
  checkbox.addEventListener('change', () => {
    toggleSelectedButtons();
    saveTodos();
    updateStatusText();
  });
  taskContent.appendChild(checkbox);
  
  const taskText = document.createElement('p');
  taskText.className = 'task-text';
  taskText.textContent = todoText;
  taskText.addEventListener('click', () => {
    taskText.classList.toggle('expanded');
  });
  taskContent.appendChild(taskText);
  
  const taskActions = document.createElement('div');
  taskActions.className = 'task-actions';
  
  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
  editBtn.addEventListener('click', () => editTodo(li, taskText));
  taskActions.appendChild(editBtn);
  
  const cloneBtn = document.createElement('button');
  cloneBtn.className = 'clone-btn';
  cloneBtn.innerHTML = '<i class="bi bi-files"></i>';
  cloneBtn.addEventListener('click', () => cloneTodo(li));
  taskActions.appendChild(cloneBtn);
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
  deleteBtn.addEventListener('click', () => deleteTodo(li));
  taskActions.appendChild(deleteBtn);
  
  taskContent.appendChild(taskActions);
  li.appendChild(taskContent);
  
  const timestamp = document.createElement('div');
  timestamp.className = 'timestamp';
  timestamp.textContent = new Date().toLocaleString();
  li.appendChild(timestamp);
  
  const todoList = document.getElementById('todoList');
  if (todoList.firstChild) {
    todoList.insertBefore(li, todoList.firstChild);
  } else {
    todoList.appendChild(li);
  }
  
  todoInput.value = '';
  toggleSelectedButtons();
  saveTodos();
  updateStatusText();
}

function editTodo(li, taskText) {
  const newText = prompt('Edit your task:', taskText.textContent);
  if (newText !== null && newText.trim() !== '') {
    taskText.textContent = newText.trim();
    saveTodos();
    updateStatusText();
  }
}

function cloneTodo(li) {
  const clone = li.cloneNode(true);
  
  // Update the timestamp to current time
  const timestamp = clone.querySelector('.timestamp');
  timestamp.textContent = new Date().toLocaleString();
  
  // Reattach event listeners
  const taskText = clone.querySelector('.task-text');
  taskText.addEventListener('click', () => {
    taskText.classList.toggle('expanded');
  });
  
  clone.querySelector('.edit-btn').addEventListener('click', () => editTodo(clone, taskText));
  clone.querySelector('.clone-btn').addEventListener('click', () => cloneTodo(clone));
  clone.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(clone));
  clone.querySelector('.form-check-input').addEventListener('change', () => {
    toggleSelectedButtons();
    saveTodos();
    updateStatusText();
  });
  
  const todoList = document.getElementById('todoList');
  if (todoList.firstChild) {
    todoList.insertBefore(clone, todoList.firstChild);
  } else {
    todoList.appendChild(clone);
  }
  
  toggleSelectedButtons();
  saveTodos();
  updateStatusText();
}

function deleteTodo(li) {
  li.remove();
  toggleSelectedButtons();
  saveTodos();
  updateStatusText();
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
  updateStatusText();
}

function cloneSelectedTodos() {
  const checkboxes = document.querySelectorAll('#todoList .form-check-input');
  const selectedItems = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.closest('.list-group-item'));
  
  // Clone items in reverse order to maintain the same sequence
  for (let i = selectedItems.length - 1; i >= 0; i--) {
    cloneTodo(selectedItems[i]);
  }
  
  toggleSelectedButtons();
  saveTodos();
  updateStatusText();
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

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  // Update theme toggle icon
  themeToggle.innerHTML = isDarkMode ? 
    '<i class="bi bi-sun-fill"></i>' : 
    '<i class="bi bi-moon-fill"></i>';
  
  // Save preference to localStorage
  localStorage.setItem('darkMode', isDarkMode);
}

// Initialize dark mode from localStorage
function initDarkMode() {
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  }
}

// Share functionality
async function shareApp() {
  const shareData = {
    title: 'Todo List App',
    text: 'Check out this awesome Todo List app!',
    url: window.location.href
  };

  try {
    if (navigator.share) {
      // Use Web Share API if available
      await navigator.share(shareData);
    } else {
      // Fallback for browsers that don't support Web Share API
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  } catch (err) {
    console.error('Error sharing:', err);
  }
}

// Event Listeners
themeToggle.addEventListener('click', toggleDarkMode);
shareBtn.addEventListener('click', shareApp);

// Initialize dark mode on page load
initDarkMode();

// Scroll to top button functionality
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const tasksContainer = document.querySelector('.tasks-container');
let scrollCount = 0;

tasksContainer.addEventListener('scroll', () => {
  if (tasksContainer.scrollTop > 0) {
    scrollCount++;
    if (scrollCount >= 2) {
      scrollToTopBtn.classList.add('visible');
    }
  } else {
    scrollCount = 0;
    scrollToTopBtn.classList.remove('visible');
  }
});

scrollToTopBtn.addEventListener('click', () => {
  tasksContainer.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  scrollCount = 0;
  scrollToTopBtn.classList.remove('visible');
});

// Update status text
function updateStatusText() {
  const statusText = document.querySelector('.status-text');
  const todoList = document.getElementById('todoList');
  const selectedTasks = document.querySelectorAll('#todoList .list-group-item input[type="checkbox"]:checked');
  const totalTasks = todoList.children.length;

  if (totalTasks === 0) {
    statusText.textContent = 'Feel free to add tasks';
  } else if (selectedTasks.length === 0) {
    statusText.textContent = `${totalTasks} task${totalTasks === 1 ? '' : 's'} in todo list`;
  } else {
    statusText.textContent = `${selectedTasks.length} task${selectedTasks.length === 1 ? '' : 's'} selected`;
  }
}

// Update status text when tasks are added, deleted, or selected
document.addEventListener('DOMContentLoaded', () => {
  updateStatusText();
  
  // Add event listener for checkbox changes
  document.getElementById('todoList').addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      updateStatusText();
    }
  });
});
