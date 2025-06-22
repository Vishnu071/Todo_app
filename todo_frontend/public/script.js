function renderTasks(tasks) {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  let completed = 0;

  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task";
    if (task.status === "Completed") div.classList.add("completed");

    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Priority: ${task.priority}</p>
      <p>Deadline: ${task.deadline ? task.deadline.split("T")[0] : "N/A"}</p>
      <p>Status: ${task.status}</p>
      <div style="margin-top: 12px; display: flex; gap: 10px;">
        <button 
          class="complete-btn"
          onclick="updateTask('${task._id}', 'Completed')" 
          ${task.status === "Completed" ? "disabled" : ""}>
          ✔ Complete
        </button>
        <button 
          class="edit-btn"
          onclick='startEditTask(${JSON.stringify(task)})'>
          ✏️ Edit
        </button>
        <button 
          class="delete-btn"
          onclick="confirmDelete('${task._id}')">
          🗑 Delete
        </button>
      </div>
    `;

    if (task.status === "Completed") completed++;
    list.appendChild(div);
  });

  const percent = tasks.length
    ? Math.floor((completed / tasks.length) * 100)
    : 0;
  document.getElementById("progressBar").style.width = percent + "%";
}

function confirmDelete(taskId) {
  if (confirm("Are you sure you want to delete this task?")) {
    deleteTask(taskId);
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  // Save preference in localStorage
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

let editingTaskId = null;

function startEditTask(task) {
  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description;
  document.getElementById("deadline").value = task.deadline
    ? task.deadline.split("T")[0]
    : "";
  document.getElementById("priority").value = task.priority;
  editingTaskId = task._id;

  document.getElementById("addTaskBtn").classList.add("hidden");
  document.getElementById("saveTaskBtn").classList.remove("hidden");
}

function saveTask() {
  const updatedTask = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    deadline: document.getElementById("deadline").value,
    priority: document.getElementById("priority").value,
  };
  fetch("https://todo-app-full-6.onrender.com/api/tasks/" + editingTaskId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(updatedTask),
  }).then(() => {
    editingTaskId = null;
    document.getElementById("taskForm").reset();
    document.getElementById("addTaskBtn").classList.remove("hidden");
    document.getElementById("saveTaskBtn").classList.add("hidden");
    getTasks();
  });
}
