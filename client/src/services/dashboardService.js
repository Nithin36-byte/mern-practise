const API_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const getDashboardStats = async (days = "30") => {
    const token = sessionStorage.getItem("token");

    if (!token) {
        throw new Error("Please log in again. Your login token is missing.");
    }

    const response = await fetch(
        `${API_URL}/dashboard/stats?days=${days}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Unable to load dashboard");
    }

    return result.data;
};