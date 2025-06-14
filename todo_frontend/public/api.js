function getTasks() {
  fetch("https://todo-app-full-6.onrender.com/api/tasks", {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => res.json())
    .then(renderTasks);
}

function addTask() {
  const task = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    deadline: document.getElementById("deadline").value,
    priority: document.getElementById("priority").value,
  };
  fetch("https://todo-app-full-6.onrender.com/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(task),
  }).then(() => {
    document.getElementById("sound").play();
    getTasks();
  });
}

function updateTask(id, status) {
  fetch("https://todo-app-full-6.onrender.com/api/tasks/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ status }),
  }).then(getTasks);
}

function deleteTask(id) {
  fetch("https://todo-app-full-6.onrender.com/api/tasks/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  }).then(getTasks);
}
