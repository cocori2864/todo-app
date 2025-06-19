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

    // 상태 상수
    const STATUS = {
        TODO: '미진행',
        DOING: '진행중',
        DONE: '완료',
        DELETED: '삭제'
    };

    // 필터 상태
    let filterOn = false;

    // 로컬스토리지에서 todo 불러오기
    function loadTodos() {
        const data = localStorage.getItem('todos');
        return data ? JSON.parse(data) : [];
    }

    // 로컬스토리지에 todo 저장
    function saveTodos(todos) {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // todo 렌더링
    function renderTodos() {
        const todos = loadTodos();
        todoList.innerHTML = '';
        todos.forEach((todo, idx) => {
            if (todo.status === STATUS.DELETED) return; // 삭제된 항목은 표시하지 않음
            if (filterOn && todo.status === STATUS.DONE) return; // 완료 숨기기
            const li = document.createElement('li');
            li.textContent = todo.text + ' [' + todo.status + ']';
            // 상태에 따라 스타일 적용
            if (todo.status === STATUS.DONE) li.style.textDecoration = 'line-through';
            else if (todo.status === STATUS.DOING) li.style.fontWeight = 'bold';
            // 상태 변경 버튼
            const stateBtn = document.createElement('button');
            stateBtn.textContent = '상태변경';
            stateBtn.style.marginLeft = '10px';
            stateBtn.addEventListener('click', function () {
                changeStatus(idx);
            });
            // 삭제 버튼
            const delBtn = document.createElement('button');
            delBtn.textContent = '삭제';
            delBtn.style.marginLeft = '5px';
            delBtn.addEventListener('click', function () {
                deleteTodo(idx);
            });
            li.appendChild(stateBtn);
            li.appendChild(delBtn);
            todoList.appendChild(li);
        });
    }

    // 상태 변경: 미진행 → 진행중 → 완료 → 미진행
    function changeStatus(idx) {
        const todos = loadTodos();
        if (todos[idx].status === STATUS.TODO) todos[idx].status = STATUS.DOING;
        else if (todos[idx].status === STATUS.DOING) todos[idx].status = STATUS.DONE;
        else if (todos[idx].status === STATUS.DONE) todos[idx].status = STATUS.TODO;
        saveTodos(todos);
        renderTodos();
    }

    // 삭제 (상태를 삭제로 변경)
    function deleteTodo(idx) {
        const todos = loadTodos();
        todos[idx].status = STATUS.DELETED;
        saveTodos(todos);
        renderTodos();
    }

    // 할 일 추가
    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText) {
            const todos = loadTodos();
            todos.push({ text: todoText, status: STATUS.TODO });
            saveTodos(todos);
            todoInput.value = '';
            renderTodos();
        }
    }

    // 완료 숨기기/보이기 토글
    function filterCompleted() {
        filterOn = !filterOn;
        filterBtn.textContent = filterOn ? '완료 보이기' : '완료 숨기기';
        renderTodos();
    }

    // 이벤트 등록
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') addTodo();
    });
    filterBtn.addEventListener('click', filterCompleted);

    // 최초 렌더링
    renderTodos();
});