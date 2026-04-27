import { useState, useEffect, useCallback } from "react";

export const useOtpTimer = (key: string, initialSeconds: number = 300) => {
    const [seconds, setSeconds] = useState(0);
    const storageKey = `otp_timer_${key}`;

    useEffect(() => {
        const savedTime = localStorage.getItem(storageKey);
        if (savedTime) {
            const remaining = Math.max(0, Math.floor((parseInt(savedTime) - Date.now()) / 1000));
            if (remaining > 0) {
                setSeconds(remaining);
            } else {
                localStorage.removeItem(storageKey);
            }
        }
    }, [storageKey]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => {
                    if (prev <= 1) {
                        localStorage.removeItem(storageKey);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [seconds, storageKey]);

    const startTimer = useCallback(() => {
        const expireTime = Date.now() + initialSeconds * 1000;
        localStorage.setItem(storageKey, expireTime.toString());
        setSeconds(initialSeconds);
    }, [initialSeconds, storageKey]);

    const formatTime = () => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return { seconds, startTimer, formatTime, isActive: seconds > 0 };
};
