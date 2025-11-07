// frontend/src/config.js
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://linked-in-clone-b2pl.onrender.com'  // Your actual backend URL on Render
  : '';

export default API_URL;
