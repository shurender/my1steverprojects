document.addEventListener('DOMContentLoaded', function () {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoPriority = document.getElementById('todo-priority');
    const todoCategory = document.getElementById('todo-category');
    const todoList = document.getElementById('todo-list');

    let dragged; // Variable to store the dragged item

    // Load todos from localStorage
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];

    // Render todos
    savedTodos.forEach(todo => addTodoToDOM(todo));

    // Add todo event
    todoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newTodo = {
            text: todoInput.value.trim(),
            priority: todoPriority.value,
            category: todoCategory.value.trim(),
            completed: false
        };

        if (newTodo.text === '') {
            return;
        }

        addTodoToDOM(newTodo);
        saveTodoToLocalStorage(newTodo);

        todoInput.value = '';
        todoPriority.value = 'not-important';
        todoCategory.value = '';
    });

    // Add todo to DOM
    function addTodoToDOM(todo) {
        const li = document.createElement('li');
        li.textContent = todo.text;

        if (todo.completed) {
            li.classList.add('completed');
        }

        li.classList.add(`priority-${todo.priority}`);

        if (todo.category) {
            const categorySpan = document.createElement('span');
            categorySpan.textContent = todo.category;
            categorySpan.classList.add('category');
            li.appendChild(categorySpan);
        }

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons');

        const completeButton = createButton('complete-button', '<i class="fas fa-check"></i> Complete', () => toggleTodoCompletion(todo, li));
        const editButton = createButton('edit-button', '<i class="fas fa-edit"></i> Edit', () => editTodoText(todo, li));
        const deleteButton = createButton('delete-button', '<i class="fas fa-trash"></i> Delete', () => {
            removeTodoFromDOM(li);
            removeTodoFromLocalStorage(todo);
        });
        const pinButton = createButton('pin-button', '<i class="fas fa-thumbtack"></i> Pin', () => pinTodoToTop(todo, li));

        buttonsDiv.appendChild(completeButton);
        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);
        buttonsDiv.appendChild(pinButton);
        li.appendChild(buttonsDiv);

        li.draggable = true;
        li.addEventListener('dragstart', dragStart);
        li.addEventListener('dragenter', dragEnter);
        li.addEventListener('dragover', dragOver);
        li.addEventListener('dragleave', dragLeave);
        li.addEventListener('drop', dragDrop);
        li.addEventListener('dragend', dragEnd);

        todoList.appendChild(li);
    }

    // Function to create button with event listener
    function createButton(className, innerHTML, onClick) {
        const button = document.createElement('button');
        button.classList.add(className);
        button.innerHTML = innerHTML;
        button.addEventListener('click', onClick);
        return button;
    }

    // Save todo to localStorage
    function saveTodoToLocalStorage(todo) {
        savedTodos.push(todo);
        localStorage.setItem('todos', JSON.stringify(savedTodos));
    }

    // Toggle todo completion
    function toggleTodoCompletion(todo, li) {
        todo.completed = !todo.completed;
        if (todo.completed) {
            li.classList.add('completed');
        } else {
            li.classList.remove('completed');
        }
        localStorage.setItem('todos', JSON.stringify(savedTodos));
    }

    // Edit todo text
    function editTodoText(todo, li) {
        const newText = prompt('Edit your task:', todo.text);
        if (newText !== null && newText.trim() !== '') {
            todo.text = newText.trim();
            li.firstChild.textContent = todo.text;
            localStorage.setItem('todos', JSON.stringify(savedTodos));
        }
    }

    // Remove todo from DOM
    function removeTodoFromDOM(todoElement) {
        todoList.removeChild(todoElement);
    }

    // Remove todo from localStorage
    function removeTodoFromLocalStorage(todo) {
        const todoIndex = savedTodos.findIndex(t => t.text === todo.text && t.priority === todo.priority && t.category === todo.category);
        if (todoIndex > -1) {
            savedTodos.splice(todoIndex, 1);
            localStorage.setItem('todos', JSON.stringify(savedTodos));
        }
    }

    // Pin todo to top
    function pinTodoToTop(todo, li) {
        todoList.removeChild(li);
        todoList.insertBefore(li, todoList.firstChild);
        updateLocalStorageOrder();
    }

    // Drag and drop functionality
    function dragStart(e) {
        dragged = e.target;
        setTimeout(() => {
            dragged.classList.add('dragging');
        }, 0);
    }

    function dragEnter(e) {
        e.preventDefault();
        if (e.target !== dragged) {
            e.target.classList.add('drag-over');
        }
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    function dragDrop(e) {
        e.preventDefault();
        if (e.target !== dragged) {
            const isAfter = dragged.compareDocumentPosition(e.target) === Node.DOCUMENT_POSITION_FOLLOWING;
            if (isAfter) {
                todoList.insertBefore(dragged, e.target.nextSibling);
            } else {
                todoList.insertBefore(dragged, e.target);
            }
        }
        e.target.classList.remove('drag-over');
        updateLocalStorageOrder();
    }

    function dragEnd() {
        dragged.classList.remove('dragging');
    }

    // Update localStorage order after drag and drop
    function updateLocalStorageOrder() {
        const updatedTodos = Array.from(todoList.children).map((li, index) => {
            const text = li.textContent.trim();
            const priority = li.classList.item(1).replace('priority-', '');
            const category = li.querySelector('.category') ? li.querySelector('.category').textContent : '';
            const completed = li.classList.contains('completed');
            return { text, priority, category, completed };
        });
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }
});
