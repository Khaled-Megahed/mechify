export const authStorage = {
  isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
  },
  getUserRole() {
    return localStorage.getItem("userRole") || "";
  },
  getUserEmail() {
    return localStorage.getItem("userEmail") || "";
  },
};

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function handleLoginSuccess(user, delay = 700) {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", user.role);
  localStorage.setItem("userEmail", user.email);

  setTimeout(() => {
    window.location.href = user.redirect;
  }, delay);
}

export function requireRole(
  expectedRole,
  redirectUrl = "/src/pages/login.html",
) {
  if (!authStorage.isLoggedIn()) {
    window.location.href = redirectUrl;
    return false;
  }

  const role = authStorage.getUserRole();
  if (!role || role.toLowerCase() !== expectedRole.toLowerCase()) {
    window.location.href = redirectUrl;
    return false;
  }

  return true;
}

export function logout(redirectUrl = "/index.html") {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  window.location.href = redirectUrl;
}
