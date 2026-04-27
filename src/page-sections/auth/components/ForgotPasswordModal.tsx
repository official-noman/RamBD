"use client";

import { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";

import Box from "@component/Box";
import Icon from "@component/icon/Icon";
import Modal from "@component/Modal";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import { Button, IconButton } from "@component/buttons";
import Typography, { H3, SemiSpan } from "@component/Typography";
import authApi from "@utils/__api__/auth";
import useVisibility from "../useVisibility";
import { useOtpTimer } from "@hook/useOtpTimer";
import { formatPhoneInput, validatePhoneNumber, isValidFirstDigit } from "@utils/phoneValidation";

interface ForgotPasswordModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP & New Password
    const [loading, setLoading] = useState(false);
    const { passwordVisibility, togglePasswordVisibility } = useVisibility();
    const otpTimer = useOtpTimer("forgot_password", 300);

    const phoneSchema = yup.object().shape({
        phone_digits: yup.string().required("Phone is required").length(9, "Enter 9 digits after +8801"),
    });

    const resetSchema = yup.object().shape({
        otp: yup.string().required("OTP is required").length(6, "OTP must be 6 digits"),
        password: yup.string().required("New password is required").min(6, "Minimum 6 characters"),
    });

    const phoneForm = useFormik({
        initialValues: { phone_digits: "" },
        validationSchema: phoneSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const fullPhone = `+8801${values.phone_digits}`;
                await authApi.forgotPassword(fullPhone);
                setLoading(false);
                setStep(2);
                otpTimer.startTimer();
                Swal.fire({ icon: "success", title: "OTP Sent", text: "Please check your SMS", timer: 2000, showConfirmButton: false });
            } catch (error: any) {
                setLoading(false);
                Swal.fire({ icon: "error", title: "Error", text: error.message || "Failed to send OTP" });
            }
        },
    });

    const resetForm = useFormik({
        initialValues: { otp: "", password: "" },
        validationSchema: resetSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const fullPhone = `+8801${phoneForm.values.phone_digits}`;
                const payload = {
                    phone: fullPhone,
                    otp: values.otp,
                    password: values.password,
                };
                const response = await authApi.sendNewPassword(payload);
                setLoading(false);
                if (response && (response.status === 200 || response.success)) {
                    Swal.fire({ icon: "success", title: "Success", text: "Password reset successful! Please login." });
                    onClose();
                } else {
                    Swal.fire({ icon: "error", title: "Error", text: response?.message || "Reset failed" });
                }
            } catch (error: any) {
                setLoading(false);
                Swal.fire({ icon: "error", title: "Error", text: error.message || "Something went wrong!" });
            }
        },
    });

    return (
        <Modal open={open} onClose={onClose}>
            <Box p="2rem" bg="white" borderRadius="8px" maxWidth="400px" width="100%">
                <H3 mb="1.5rem" textAlign="center">Forgot Password</H3>

                {step === 1 ? (
                    <form onSubmit={phoneForm.handleSubmit}>
                        <Box mb="1.5rem">
                            <Typography fontWeight="600" mb="0.5rem">Phone Number *</Typography>
                            <FlexBox
                                alignItems="center"
                                borderRadius="8px"
                                style={{
                                    border: (() => {
                                        const { color } = validatePhoneNumber(phoneForm.values.phone_digits);
                                        if (phoneForm.touched.phone_digits && phoneForm.errors.phone_digits) return "1px solid #e74c3c";
                                        return `1px solid ${color}`;
                                    })(),
                                    overflow: "hidden"
                                }}
                            >
                                <Box bg="gray.100" px="15px" py="12px" style={{ borderRight: "1px solid #dee2e6" }}>
                                    <Typography fontWeight="700">+8801</Typography>
                                </Box>
                                <input
                                    name="phone_digits"
                                    type="tel"
                                    maxLength={10}
                                    placeholder="XXXXX-XXXX"
                                    value={formatPhoneInput(phoneForm.values.phone_digits)}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        if (val.length > 0 && !isValidFirstDigit(val[0])) return;
                                        phoneForm.setFieldValue("phone_digits", val);
                                    }}
                                    style={{
                                        border: "none",
                                        outline: "none",
                                        width: "100%",
                                        padding: "12px",
                                        fontSize: "20px",
                                        fontWeight: 700,
                                        letterSpacing: "2px"
                                    }}
                                />
                            </FlexBox>
                            {(() => {
                                const { message, color } = validatePhoneNumber(phoneForm.values.phone_digits);
                                if (phoneForm.touched.phone_digits && phoneForm.errors.phone_digits) {
                                    return <Typography color="error.main" fontSize="12px" mt="4px">{phoneForm.errors.phone_digits}</Typography>;
                                }
                                return (
                                    <Typography color={color} fontSize="12px" mt="4px" fontWeight="600">
                                        {message}
                                    </Typography>
                                );
                            })()}
                        </Box>
                        <Button variant="contained" color="primary" fullwidth type="submit" disabled={loading}>
                            {loading ? "Processing..." : "Continue"}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={resetForm.handleSubmit}>
                        <Box mb="1rem" p="10px" bg="gray.100" borderRadius="4px" textAlign="center">
                            <SemiSpan color="text.muted">OTP sent to +8801{phoneForm.values.phone_digits}</SemiSpan>
                        </Box>

                        <Box mb="1.25rem">
                            <Typography fontWeight="600" mb="0.5rem">OTP *</Typography>
                            <TextField
                                fullwidth
                                name="otp"
                                placeholder="6-digit OTP"
                                value={resetForm.values.otp}
                                onChange={resetForm.handleChange}
                                onBlur={resetForm.handleBlur}
                                errorText={resetForm.touched.otp && resetForm.errors.otp}
                            />
                        </Box>

                        <Box mb="1.5rem">
                            <Typography fontWeight="600" mb="0.5rem">New Password *</Typography>
                            <TextField
                                fullwidth
                                name="password"
                                type={passwordVisibility ? "text" : "password"}
                                placeholder="*********"
                                value={resetForm.values.password}
                                onChange={resetForm.handleChange}
                                onBlur={resetForm.handleBlur}
                                errorText={resetForm.touched.password && resetForm.errors.password}
                                endAdornment={
                                    <IconButton type="button" onClick={togglePasswordVisibility} p="4px">
                                        <Icon variant="small">{passwordVisibility ? "eye-alt" : "eye"}</Icon>
                                    </IconButton>
                                }
                            />
                        </Box>

                        <Button variant="contained" color="primary" fullwidth type="submit" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>

                        <Button
                            variant="text"
                            color="primary"
                            fullwidth
                            mt="1rem"
                            disabled={otpTimer.isActive || loading}
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    const fullPhone = `+8801${phoneForm.values.phone_digits}`;
                                    await authApi.forgotPassword(fullPhone);
                                    setLoading(false);
                                    otpTimer.startTimer();
                                    Swal.fire({ icon: "success", title: "OTP Sent", text: "Please check your SMS", timer: 2000, showConfirmButton: false });
                                } catch (err: any) {
                                    setLoading(false);
                                    Swal.fire({ icon: "error", title: "Error", text: err.message || "Failed to resend OTP" });
                                }
                            }}
                        >
                            {otpTimer.isActive ? `Resend OTP in ${otpTimer.formatTime()}` : "Resend OTP"}
                        </Button>

                        <Button variant="text" color="primary" fullwidth mt="0.5rem" onClick={() => setStep(1)}>
                            Back
                        </Button>
                    </form>
                )}
            </Box>
        </Modal>
    );
}
