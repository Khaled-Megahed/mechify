import { handleLoginSuccess, validateEmail, logout } from "./auth-helper.js";
import { MockStore } from "./mockStore.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const passwordInput = document.getElementById("password");
  const togglePasswordButton = document.getElementById("togglePassword");
  const feedback = document.getElementById("login-feedback");

  if (togglePasswordButton && passwordInput) {
    togglePasswordButton.addEventListener("click", () => {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      togglePasswordButton.textContent = type === "password" ? "Show" : "Hide";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = passwordInput.value;

      if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Always search against the current state of MockStore.users
      const mockUser = MockStore.users.find(
        (u) => u.email.toLowerCase() === email && u.password === password,
      );

      if (mockUser) {
        const redirect =
          mockUser.role === "Manager" ? "./manager.html" : "./mechanic.html";
        showFeedback("Login successful! Redirecting...");
        handleLoginSuccess({ ...mockUser, redirect });
        return;
      }

      showFeedback("Invalid email or password. Please try again.", true);
    });
  }

  function showFeedback(message, isError = false) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.toggle("bg-red-50", isError);
    feedback.classList.toggle("border-red-500", isError);
    feedback.classList.toggle("text-red-800", isError);
    feedback.classList.toggle("bg-emerald-50", !isError);
    feedback.classList.toggle("border-emerald-500", !isError);
    feedback.classList.toggle("text-emerald-800", !isError);
    feedback.classList.remove("hidden");
  }
});

window.logout = logout;
