import axios from "axios";

let baseURL;

if (window.location.hostname === "localhost") {
    baseURL = "http://localhost:8080/api";
} else {
    baseURL = `${window.location.origin}/api`;
}

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json"
    },
});

export default api;