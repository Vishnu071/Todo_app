let token = "";

function register() {
  fetch("https://todo-app-full-6.onrender.com/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      username: document.getElementById("email").value.split("@")[0],
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "Registered successfully!");
    })
    .catch((err) => console.error(err));
}

// Show navbar and user email after login
function showNavbar(email) {
  document.querySelector(".navbar").classList.remove("hidden");
  document.getElementById("userEmail").textContent = email;
}

// Hide navbar on logout
function hideNavbar() {
  document.querySelector(".navbar").classList.add("hidden");
  document.getElementById("userEmail").textContent = "";
}

// Logout function
document.getElementById("logoutBtn").onclick = function () {
  token = "";
  hideNavbar();
  document.querySelector(".auth-section").classList.remove("hidden");
  document.querySelector(".task-section").classList.add("hidden");
};

// Login function with navbar logic
function login() {
  fetch("https://todo-app-full-6.onrender.com/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        token = data.token;
        document.querySelector(".auth-section").classList.add("hidden");
        document.querySelector(".task-section").classList.remove("hidden");
        showNavbar(document.getElementById("email").value);
        getTasks();
      } else {
        alert(data.message);
      }
    });
}
