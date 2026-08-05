
let tasks = [];
let taskId = 0;

function saveTasks() 
{
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
    localStorage.setItem("kanbanTaskId", taskId);
}

function loadTasks() 
{
    const savedTasks = localStorage.getItem("kanbanTasks");
    const savedId = localStorage.getItem("kanbanTaskId");

    if (savedTasks) 
    {
        tasks = JSON.parse(savedTasks);

        // Add countedToday to old tasks that don't have it yet
        tasks.forEach(task => {
            if (task.countedToday === undefined) {
                task.countedToday = false;
            }
        });
    }

    if (savedId) 
    {
        taskId = parseInt(savedId);
    }

    const stats = JSON.parse(localStorage.getItem("taskStats"));
    if (stats) {
        updateScoreDisplay(stats);
    }

    renderBoard();
}

function renderBoard() 
{
    document.querySelectorAll(".task-list").forEach(column => 
    {
        column.innerHTML = "";
    });

    tasks.forEach(task => 
    {
        const taskElement = document.createElement("div");

        taskElement.className = "task";
        taskElement.id = "task-" + task.id;
        taskElement.draggable = true;

        if (task.column === "done") {
            taskElement.classList.add("completed");
        }
        taskElement.addEventListener("dragstart", drag);

        taskElement.innerHTML = `
            <div class="task-content">
                <span>${task.text}</span>
                <button class="delete" onclick="deleteTask(${task.id})">×</button>
            </div>
        `;
        const column = document.getElementById(task.column);
        if (column)
        {
            column.appendChild(taskElement);
        }
    });
    increaseCounter();
}

function increaseCounter() 
{
    const counter = tasks.filter(task => task.column === "done").length;
    let text;
    if (counter === 1){
        text = `You have completed ${counter} task today!`;
    }
    else {
        text = `You have completed ${counter} tasks today!`;
    }
    document.getElementById("counttasks").textContent = text;
}

function addTask() 
{
    const input = document.getElementById("addtask");
    const text = input.value.trim();

    tasks.push({
    id: taskId++,
    text: text,
    column: "todo",
    countedToday: false
    });

    if (text === "") return;
    tasks.push({
        id: taskId++,
        text: text,
        column: "todo",
    });

    input.value = "";

    saveTasks();
    renderBoard();
}

function deleteTask(id) 
{
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderBoard();
}

function allowDrop(e) 
{
    e.preventDefault();
}

function drag(e) 
{
    e.dataTransfer.setData("text/plain", e.currentTarget.id);
}

function drop(e) 
{
    e.preventDefault();

    const draggedHtmlId = e.dataTransfer.getData("text/plain");
    const draggedId = parseInt(draggedHtmlId.replace("task-", ""));

    const draggedTask = tasks.find(t => t.id === draggedId);

    if (!draggedTask) return;

    const previousColumn = draggedTask.column;
    const column = e.target.closest(".task-list");

    if (!column) return;
    const columnId = column.id;

    const oldIndex = tasks.findIndex(t => t.id === draggedId);
    tasks.splice(oldIndex, 1);
    draggedTask.column = columnId;

    if (columnId === "done" && !draggedTask.countedToday) {
    completeTask();
    draggedTask.countedToday = true;
    }

    const targetTaskElement = e.target.closest(".task");

    if (!targetTaskElement) 
    {
        let insertIndex = tasks.length;
        for (let i = tasks.length - 1; i >= 0; i--) 
        {
            if (tasks[i].column === columnId) 
            {
                insertIndex = i + 1;
                break;
            }
        }
        tasks.splice(insertIndex, 0, draggedTask);
    } 
    else 
    {
        const targetId = parseInt(targetTaskElement.id.replace("task-", ""));
        const targetIndex = tasks.findIndex(t => t.id === targetId);
        const rect = targetTaskElement.getBoundingClientRect();
        const before =
            e.clientY < rect.top + rect.height / 2;
        const insertIndex = before ? targetIndex : targetIndex + 1;
        tasks.splice(insertIndex, 0, draggedTask);
    }
    saveTasks();
    renderBoard();
}
document.getElementById("addtask").addEventListener("keypress", function(e) 
{
    if (e.key === "Enter") 
    {
        addTask();
    }
});
loadTasks();

function completeTask() 
{
    let today = new Date().toISOString().split("T")[0];

    let data = JSON.parse(localStorage.getItem("taskStats")) || {
        date: today,
        todayCompleted: 0,
        highscore: 0
    };

    // New day? Reset today's counter and allow every task to count again.
    if (data.date !== today) {
        data.date = today;
        data.todayCompleted = 0;

        tasks.forEach(task => {
            task.countedToday = false;
        });

        saveTasks();
    }

    data.todayCompleted++;

    if (data.todayCompleted > data.highscore) {
        data.highscore = data.todayCompleted;
    }

    localStorage.setItem("taskStats", JSON.stringify(data));

    updateScoreDisplay(data);
}

function updateScoreDisplay(data) {
    document.getElementById("highscore").innerHTML =
        `Highscore:<br>${data.highscore}`;
}

function resetHighscore() {
    if (!confirm("This will reset your highscore! Are you sure?")) {
        return;
    }

    const today = new Date().toISOString().split("T")[0];

    const data = {
        date: today,
        todayCompleted: 0,
        highscore: 0
    };

    localStorage.setItem("taskStats", JSON.stringify(data));

    tasks.forEach(task => {
        task.countedToday = false;
    });

    saveTasks();
    updateScoreDisplay(data);
}