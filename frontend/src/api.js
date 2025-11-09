import axios from "axios";

const API = axios.create({
  baseURL: "https://learnato-yash.onrender.com/api",
});

export default API;
