import axios from "@lib/axios";

const getNavbarServices = async () => {
    try {
        const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();
        const response = await axios.get(`${apiBaseUrl}/home-menu`);
        return response.data;
    } catch (error) {
        console.error("getNavbarServices face error:", error);
        return null;
    }
};

export default { getNavbarServices };
