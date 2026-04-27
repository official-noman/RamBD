import axios from "@lib/axios";
import axiosInstance from "@lib/axios";

const getDistrictsAndThanas = async () => {
    try {
        const response = await axiosInstance.get("/remote-api/district-thana");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch districts and thanas:", error);
        return { district: [], thana: [] };
    }
};

const getShippingCost = async (districtId: string | number) => {
    try {
        const url = `/remote-api/api/get-shipping-cost?district=${districtId}`;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch shipping cost:", error);
        return { success: false, data: { price: 0 } };
    }
};

const placeOrder = async (orderData: any) => {
    try {
        console.log("Placing order with payload:", JSON.stringify(orderData, null, 2));
        const url = "/remote-api/api/order-places";
        const response = await axiosInstance.post(url, orderData);
        return response.data;
    } catch (error) {
        console.error("Failed to place order:", error);
        return { success: false, message: "Failed to place order" };
    }
};

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();

const generateOtp = async (phone: string) => {
    try {
        const normalizedPhone = phone.replace(/\D/g, "").slice(-11);
        const url = `${apiBaseUrl}/api/generate-otp`;

        console.log("🚀 [CHECKOUT] OTP Request:", { url, phone: normalizedPhone });

        const response = await axios.get(url, {
            params: { phone: normalizedPhone }
        });

        console.log("✅ [CHECKOUT] OTP Success:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [CHECKOUT] OTP Error:", error.response?.data || error.message);
        return { success: false, message: error.message };
    }
};

const getUserByPhone = async (phone: string) => {
    try {
        const normalizedPhone = phone.replace(/\D/g, "").slice(-11);
        const url = `${apiBaseUrl}/api/get-user-by-phone`;

        console.log("🔍 [CHECKOUT] User Request:", { url, phone: normalizedPhone });

        const response = await axios.get(url, {
            params: { phone: normalizedPhone }
        });

        console.log("👤 [CHECKOUT] User Success:", response.data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            console.log("⚠️ [CHECKOUT] User not found (404)");
            return { success: false, status: 404, message: "User not found" };
        }
        console.error("❌ [CHECKOUT] User Error:", error.response?.data || error.message);
        return { success: false, message: "Failed to fetch user" };
    }
};

export default { getDistrictsAndThanas, getShippingCost, placeOrder, generateOtp, getUserByPhone };
