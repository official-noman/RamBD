export const formatPhoneInput = (input: string): string => {
    const digits = input.replace(/\D/g, "");
    if (digits.length > 5) {
        return digits.slice(0, 5) + "-" + digits.slice(5, 9);
    }
    return digits.slice(0, 9);
};

export const validatePhoneNumber = (phone: string): { isValid: boolean; message: string; color: string } => {
    const raw = phone.replace("+8801", "").replace(/-/g, "");

    if (raw.length === 0) {
        return { isValid: false, message: "", color: "#dee2e6" };
    }

    if (raw.length < 9) {
        const remaining = 9 - raw.length;
        return {
            isValid: false,
            message: `⚠ Enter ${remaining} more digit${remaining > 1 ? "s" : ""} to complete the number`,
            color: "#e74c3c"
        };
    }

    if (raw.length === 9) {
        return { isValid: true, message: "✓ Valid phone number", color: "#2ba56d" };
    }

    return { isValid: false, message: "⚠ Invalid phone number", color: "#e74c3c" };
};

export const isValidFirstDigit = (digit: string): boolean => {
    const num = parseInt(digit);
    return num >= 3 && num <= 9;
};
