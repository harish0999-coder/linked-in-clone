// frontend/src/config.js
// Prefer env var; fall back to your Render URL in production; localhost in dev.
const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://linked-in-clone-b2pl.onrender.com"
    : "http://localhost:5000"); // match your local server port

export default API_URL;
