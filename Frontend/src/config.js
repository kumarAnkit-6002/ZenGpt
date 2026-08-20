const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL;
const productionBackendUrl = "";

export const backendUrl = import.meta.env.PROD
    ? productionBackendUrl
    : (configuredBackendUrl || "http://localhost:8080");
