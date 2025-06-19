// todo app을 위한 script.js 전체 코드

document.addEventListener('DOMContentLoaded', function () {
    // HTML 요소 동적 생성
    const app = document.createElement('div');
    app.id = 'todo-app';
    app.innerHTML = `
        <h1>Todo List</h1>
        <input id="todo-input" type="text" placeholder="할 일을 입력하세요" />
        <button id="add-btn">추가</button>
        <button id="filter-btn">완료 숨기기</button>
        <ul id="todo-list"></ul>
    `;
    document.body.appendChild(app);

    // 요소 참조
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const filterBtn = document.getElementById('filter-btn');
    const todoList = document.getElementById('todo-list');

    // 할 일 추가 함수
    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText) {
            const li = document.createElement('li');
            li.textContent = todoText;
            li.addEventListener('click', function () {
                li.classList.toggle('completed');
            });
            // 삭제 버튼 추가
            const delBtn = document.createElement('button');
            delBtn.textContent = '삭제';
            delBtn.style.marginLeft = '10px';
            delBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                todoList.removeChild(li);
            });
            li.appendChild(delBtn);
            todoList.appendChild(li);
            todoInput.value = '';
        }
    }

    // 완료된 할 일 숨기기/보이기 토글
    let filterOn = false;
    function filterCompleted() {
        const todos = document.querySelectorAll('#todo-list li');
        filterOn = !filterOn;
        filterBtn.textContent = filterOn ? '완료 보이기' : '완료 숨기기';
        todos.forEach(todo => {
            if (todo.classList.contains('completed')) {
                todo.style.display = filterOn ? 'none' : 'block';
            } else {
                todo.style.display = 'block';
            }
        });
    }

    // 이벤트 등록
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') addTodo();
    });
    filterBtn.addEventListener('click', filterCompleted);
});