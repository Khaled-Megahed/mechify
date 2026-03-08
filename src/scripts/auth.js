document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const passwordInput = document.getElementById("password");
  const togglePasswordButton = document.getElementById("togglePassword");

  // Fake Database
  const mockUsers = [
    {
      email: "mechanic@gmail.com",
      password: "123456",
      role: "Mechanic",
      /** * FIX: Use relative paths for the current directory.
       * Since login.html and mechanic.html are in the same folder,
       * we just use "./filename.html"
       */
      redirect: "./mechanic.html",
    },
    {
      email: "manager@gmail.com",
      password: "123456",
      role: "Manager",
      redirect: "./manager.html",
    },
  ];

  // 1. Toggle Password Visibility
  if (togglePasswordButton && passwordInput) {
    togglePasswordButton.addEventListener("click", () => {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      togglePasswordButton.textContent = type === "password" ? "Show" : "Hide";
    });
  }

  // 2. Form Submission Handling
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = passwordInput.value;

      if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      const user = mockUsers.find(
        (u) => u.email === email && u.password === password,
      );

      if (user) {
        // SESSION MANAGEMENT
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userEmail", user.email);

        // SUCCESS REDIRECTION
        window.location.href = user.redirect;
      } else {
        alert("Invalid credentials. Try: mechanic@gmail.com / 123456");
      }
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});

/**
 * Global Logout Function
 */
window.logout = function () {
  localStorage.clear();
  window.location.href = "/index.html"; // Go back to landing page
};
