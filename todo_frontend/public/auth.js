let token = "";

// Register function
function register() {
  const emailInput = document.getElementById("registerEmail");
  const passwordInput = document.getElementById("registerPassword");

  if (!emailInput || !passwordInput) {
    alert("Registration form is not loaded correctly.");
    return;
  }

  fetch("https://todo-app-full-6.onrender.com/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value,
      username: emailInput.value.split("@")[0],
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
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");

  if (!emailInput || !passwordInput) {
    alert("Login form is not loaded correctly.");
    return;
  }

  fetch("https://todo-app-full-6.onrender.com/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        token = data.token;
        document.querySelector(".auth-section").classList.add("hidden");
        document.querySelector(".task-section").classList.remove("hidden");
        showNavbar(emailInput.value);
        getTasks();
      } else {
        alert(data.message);
      }
    });
}
