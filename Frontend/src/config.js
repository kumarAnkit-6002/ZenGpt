const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL;
const productionBackendUrl = "https://zengptbackend2.onrender.com";

export const backendUrl = import.meta.env.PROD && !configuredBackendUrl?.startsWith("https://")
    ? productionBackendUrl
    : (configuredBackendUrl || "http://localhost:8080");
