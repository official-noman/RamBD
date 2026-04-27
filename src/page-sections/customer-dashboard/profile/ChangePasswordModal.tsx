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
import Typography, { H3 } from "@component/Typography";
import authApi from "@utils/__api__/auth";
import { useAppContext } from "@context/app-context";
import useVisibility from "../../auth/useVisibility";

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
    const { state } = useAppContext();
    const [step, setStep] = useState(1); // 1: Masked Phone/OTP, 2: OTP & New Password
    const [loading, setLoading] = useState(false);
    const { passwordVisibility, togglePasswordVisibility } = useVisibility();

    const phone = state.user?.phone || "";
    const maskedPhone = phone.length > 2
        ? `${phone.substring(0, 5)}XXXXX${phone.substring(phone.length - 2)}`
        : phone;

    const otpSchema = yup.object().shape({
        otp: yup.string().required("OTP is required").length(6, "OTP must be 6 digits"),
        password: yup.string().required("New password is required").min(6, "Minimum 6 characters"),
    });

    const handleRequestOtp = async () => {
        try {
            setLoading(true);
            await authApi.forgotPassword(phone); // Reuse forgotPassword for sending OTP
            setLoading(false);
            setStep(2);
            Swal.fire({ icon: "success", title: "OTP Sent", text: "Please check your SMS", timer: 2000, showConfirmButton: false });
        } catch (error: any) {
            setLoading(false);
            Swal.fire({ icon: "error", title: "Error", text: error.message || "Failed to send OTP" });
        }
    };

    const formik = useFormik({
        initialValues: { otp: "", password: "" },
        validationSchema: otpSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const payload = {
                    phone: phone,
                    otp: values.otp,
                    password: values.password,
                    token: state.user?.token,
                };
                const response = await authApi.updatePassword(payload);
                setLoading(false);
                if (response && (response.status === 200 || response.success)) {
                    Swal.fire({ icon: "success", title: "Success", text: "Password changed successfully!" });
                    onClose();
                    setStep(1);
                    formik.resetForm();
                } else {
                    Swal.fire({ icon: "error", title: "Error", text: response?.message || "Failed to change password" });
                }
            } catch (error: any) {
                setLoading(false);
                Swal.fire({ icon: "error", title: "Error", text: error.message || "Something went wrong!" });
            }
        },
    });

    return (
        <Modal open={open} onClose={() => { onClose(); setStep(1); formik.resetForm(); }}>
            <Box p="2rem" bg="white" borderRadius="8px" maxWidth="450px" width="100%">
                <H3 mb="2rem" textAlign="center">Change Password</H3>

                {step === 1 ? (
                    <Box textAlign="center">
                        <Typography mb="1.5rem" color="text.muted">
                            To change your password, we need to verify your identity. An OTP will be sent to your registered number:
                        </Typography>

                        <Box bg="gray.100" p="1rem" borderRadius="8px" mb="2rem">
                            <Typography fontWeight="700" fontSize="18px">{maskedPhone}</Typography>
                        </Box>

                        <Button variant="contained" color="primary" fullwidth onClick={handleRequestOtp} disabled={loading}>
                            {loading ? "Processing..." : "Send OTP"}
                        </Button>
                    </Box>
                ) : (
                    <form onSubmit={formik.handleSubmit}>
                        <Box mb="1.5rem">
                            <Typography fontWeight="600" mb="0.5rem">Enter OTP *</Typography>
                            <TextField
                                fullwidth
                                name="otp"
                                placeholder="6-digit code"
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorText={formik.touched.otp && formik.errors.otp}
                            />
                        </Box>

                        <Box mb="2rem">
                            <Typography fontWeight="600" mb="0.5rem">New Password *</Typography>
                            <TextField
                                fullwidth
                                name="password"
                                type={passwordVisibility ? "text" : "password"}
                                placeholder="Minimum 6 characters"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorText={formik.touched.password && formik.errors.password}
                                endAdornment={
                                    <IconButton type="button" onClick={togglePasswordVisibility} p="4px">
                                        <Icon variant="small">{passwordVisibility ? "eye-alt" : "eye"}</Icon>
                                    </IconButton>
                                }
                            />
                        </Box>

                        <Button variant="contained" color="primary" fullwidth type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Change Password"}
                        </Button>

                        <Button variant="text" color="primary" fullwidth mt="1rem" onClick={() => setStep(1)}>
                            Back
                        </Button>
                    </form>
                )}
            </Box>
        </Modal>
    );
}
