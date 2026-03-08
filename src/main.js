// 1. Import Tailwind/Global CSS so Vite processes it
import "./style.css";

/**
 * Robot Mascot Logic - Simple Welcome
 */
const robotContainer = document.getElementById("robot-container");
const messageText = document.getElementById("message-text");

if (robotContainer && messageText) {
  // Set initial welcome state
  messageText.textContent = "Welcome to Mechify!";

  // Optional: Gentle hover effect to make it feel alive
  robotContainer.addEventListener("mouseenter", () => {
    messageText.textContent = "Ready to work?";
  });

  robotContainer.addEventListener("mouseleave", () => {
    messageText.textContent = "Welcome to Mechify!";
  });
}
