
function renderTasks(tasks) {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  let completed = 0;

  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task";
    div.style = "border: 1px solid #ccc; padding: 16px; border-radius: 10px; margin-bottom: 12px; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.1);";
    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Priority: ${task.priority}</p>
      <p>Deadline: ${task.deadline ? task.deadline.split("T")[0] : "N/A"}</p>
      <p>Status: ${task.status}</p>
      <div style="margin-top: 12px;">
        <button 
          onclick="updateTask('${task._id}', 'Completed')" 
          ${task.status === "Completed" ? "disabled" : ""} 
          style="
            background-color: ${task.status === 'Completed' ? '#ccc' : '#22c55e'};
            color: white;
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            margin-right: 10px;
            font-size: 14px;
            cursor: ${task.status === 'Completed' ? 'not-allowed' : 'pointer'};
            transition: background-color 0.3s ease;">
          ✔ Complete
        </button>
        <button 
          onclick="confirmDelete('${task._id}')" 
          style="
            background-color: #ef4444;
            color: white;
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.3s ease;">
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
