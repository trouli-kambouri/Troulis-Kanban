let taskId = 0;

function addTask() {

    const input = document.getElementById("addtask");

    const text = input.value.trim();

    if (text === "") return;

    const task = document.createElement("div");

    task.className = "task";
    task.draggable = true;
    task.id = "task-" + taskId++;

    task.addEventListener("dragstart", drag);

    task.innerHTML = `
    <span>${text}</span>
    <button class="delete" onclick="this.parentElement.remove()">×</button>
    `;

    document.getElementById("todo").appendChild(task);

    input.value = "";
}

function allowDrop(e) {
    e.preventDefault();
}

function drag(e) {
    e.dataTransfer.setData("text", e.target.id);
}

function drop(e) {
    e.preventDefault();

    const id = e.dataTransfer.getData("text");

    const task = document.getElementById(id);

    if (e.target.classList.contains("task-list")) {
        e.target.appendChild(task);
        if (e.target.id === "done") 
        {
            task.classList.add("completed");
        } else 
        {
            task.classList.remove("completed");
        }
    }

}

document.getElementById("addtask").addEventListener("keypress", function(e){
    if(e.key==="Enter"){
        addTask();
    }
});