import axios from "axios";

const API_URL = "http://192.168.100.8:8081/api"; // Altere para o IP do seu backend

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // Tempo limite para evitar loops infinitos caso a API não responda
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;