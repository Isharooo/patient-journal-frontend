import axios from "axios";

let baseURL;

if (window.location.hostname === "localhost") {
    // När du kör Docker eller lokalt
    baseURL = "http://localhost:8080/api";
} else {
    // Produktionsläge bakom nginx
    baseURL = `${window.location.origin}/api`;
}

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json"
    },
});

export default api;