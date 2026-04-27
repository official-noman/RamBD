import axios from "@lib/axios";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();

const normalizePhone = (phone: string) => {
    // Remove all non-digits
    let digits = phone.replace(/\D/g, "");
    // Handle BD format: if starts with 880, take last 11. if starts with 0, take all 11.
    // If it's something like 019..., keep it. If it's 88019..., take 019...
    if (digits.startsWith("880") && digits.length > 11) {
        digits = digits.substring(2);
    }
    // Ensure it starts with 0 for the API if it's 10 digits (missing leading 0)
    if (digits.length === 10 && digits.startsWith("1")) {
        digits = "0" + digits;
    }
    return digits;
};

const register = async (payload: any) => {
    try {
        const url = `${apiBaseUrl}/api/cus-register`;
        const normalizedPayload = { ...payload, phone: normalizePhone(payload.phone) };
        console.log("🚀 [AUTH] Register Request:", { url, payload: normalizedPayload });
        const response = await axios.post(url, normalizedPayload);
        console.log("✅ [AUTH] Register Success:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [AUTH] Register Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
        });
        throw error.response?.data || { message: error.message };
    }
};

const verifyPhone = async (phone: string, pincode: string) => {
    try {
        const digits = normalizePhone(phone);
        const url = `${apiBaseUrl}/api/cus-verifyphone/${digits}`;
        const payload = { phone: digits, pincode };
        console.log("🚀 [AUTH] Verify Request:", { url, payload });
        const response = await axios.post(url, payload);
        console.log("✅ [AUTH] Verify Success:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [AUTH] Verify Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
        });
        throw error.response?.data || { message: error.message };
    }
};

const generateOtp = async (phone: string) => {
    try {
        const digits = normalizePhone(phone);
        const url = `${apiBaseUrl}/api/generate-otp`;
        console.log("🚀 [AUTH] OTP Request:", { url, phone: digits });
        const response = await axios.get(url, { params: { phone: digits } });
        console.log("✅ [AUTH] OTP Success:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [AUTH] OTP Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
        });
        throw error.response?.data || { message: error.message };
    }
};

const login = async (payload: any) => {
    const digits = normalizePhone(payload.phone);
    const normalizedPayload = {
        email: digits,
        phone: digits, // Send both for compatibility
        password: payload.password
    };

    try {
        const url = `${apiBaseUrl}/api/customer-login-page`;
        console.log("🚀 [AUTH] Login Request:", { url, payload: { ...normalizedPayload, password: "***" } });
        const response = await axios.post(url, normalizedPayload);
        console.log("✅ [AUTH] Login Success:", response.data);
        return response.data;
    } catch (error: any) {
        const errorData = error.response?.data;
        const status = error.response?.status;
        const message = error.message;

        // Always log the raw error first so it's never empty {}
        console.error("❌ [AUTH] Login Error (raw):", error);
        console.error("❌ [AUTH] Login Error Context:", {
            status: status ?? "no-status",
            message: message ?? "no-message",
            url: error.config?.url ?? "no-url",
            errorData: errorData ? JSON.stringify(errorData) : "no-error-data"
        });

        // Ensure we throw something meaningful
        throw errorData || { message: message || "Login failed. Please try again." };
    }
};

const changePassword = async (payload: any) => {
    try {
        const phone = normalizePhone(payload.phone || "");
        const url = `${apiBaseUrl}/api/set-password-otp/${phone}`;
        // The user specifically mentioned POST for change password
        const response = await axios.post(url, payload, {
            headers: { Authorization: `Bearer ${payload.token}` }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: error.message };
    }
};

const forgotPassword = async (phone: string) => {
    try {
        const digits = normalizePhone(phone);
        const url = `${apiBaseUrl}/api/set-password-otp/${digits}`;
        const response = await axios.post(url, { phone: digits });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: error.message };
    }
};

const sendNewPassword = async (payload: any) => {
    try {
        const digits = normalizePhone(payload.phone);
        const url = `${apiBaseUrl}/api/set-new-password/${digits}`;
        // Reset password (forgot flow) needs PUT according to user feedback
        const response = await axios.put(url, {
            phone: digits,
            email: digits,
            pincode: payload.otp || payload.pincode,
            password: payload.password,
            password_confirmation: payload.password
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: error.message };
    }
};

const updatePassword = async (payload: any) => {
    try {
        const digits = normalizePhone(payload.phone);
        const url = `${apiBaseUrl}/api/set-new-password/${digits}`;
        // Change password (logged-in flow) - switching to PUT as server rejected POST
        const response = await axios.put(url, {
            phone: digits,
            email: digits,
            pincode: payload.otp || payload.pincode,
            password: payload.password,
            password_confirmation: payload.password
        }, {
            headers: { Authorization: `Bearer ${payload.token}` }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: error.message };
    }
};

export default { register, verifyPhone, generateOtp, login, changePassword, forgotPassword, sendNewPassword, updatePassword };
