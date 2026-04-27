"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";

import useVisibility from "./useVisibility";

import Box from "@component/Box";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import CheckBox from "@component/CheckBox";
import TextField from "@component/text-field";
import Modal from "@component/Modal";
import { Button, IconButton } from "@component/buttons";
import Typography, { H3, H5, H6, SemiSpan } from "@component/Typography";
import { useAppContext } from "@context/app-context";

import { StyledRoot } from "./styles";
import authApi from "@utils/__api__/auth";
import Select from "@component/Select";
import Grid from "@component/grid/Grid";
import checkoutApi from "@utils/__api__/checkout";
import { useEffect, useState } from "react";
import { useOtpTimer } from "@hook/useOtpTimer";
import { formatPhoneInput, validatePhoneNumber, isValidFirstDigit } from "@utils/phoneValidation";

export default function Signup() {
  const router = useRouter();
  const { dispatch } = useAppContext();
  const { passwordVisibility, togglePasswordVisibility } = useVisibility();
  const [loading, setLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sessionUser, setSessionUser] = useState<any>(null);
  const otpTimer = useOtpTimer("signup", 300);

  const [districts, setDistricts] = useState<any[]>([]);
  const [allThanas, setAllThanas] = useState<any[]>([]);
  const [thanas, setThanas] = useState<any[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const data = await checkoutApi.getDistrictsAndThanas();
      if (data && Array.isArray(data.district)) {
        const formattedDistricts = data.district
          .map((d: any) => ({
            label: d.district,
            value: d.id
          }))
          .sort((a: any, b: any) => a.label.localeCompare(b.label));
        setDistricts(formattedDistricts);
        setAllThanas(data.thana || []);
      }
    };
    fetchLocations();
  }, []);

  const initialValues = {
    name: "",
    email: "",
    phone_digits: "",
    gender: 1, // 1: Male, 2: Female, 3: Others
    district: "",
    thana: "",
    agreement: true
  };

  const formSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("invalid email").nullable(),
    phone_digits: yup.string().required("Phone is required").length(9, "Enter 9 digits after +8801"),
    gender: yup.number().required("Gender is required"),
    district: yup.string().required("District is required"),
    thana: yup.string().required("Thana is required")
  });

  const handleFormSubmit = async (values: any) => {
    try {
      setLoading(true);
      const fullPhone = `+8801${values.phone_digits}`;
      const payload = {
        name: values.name,
        email: values.email,
        phone: fullPhone,
        district_id: values.district,
        thana_id: values.thana,
        gender: values.gender
      };

      const response = await authApi.register(payload);
      setLoading(false);

      if (response && (response.status === 200 || response.success)) {
        setSessionUser({ phone: fullPhone, name: values.name });

        // Save name mapping for login fallback
        try {
          const namesMap = JSON.parse(localStorage.getItem("rambd_phone_names") || "{}");
          namesMap[fullPhone] = values.name;
          localStorage.setItem("rambd_phone_names", JSON.stringify(namesMap));
          console.log("💾 [SIGNUP] Name mapped for fallback:", { [fullPhone]: values.name });
        } catch (e) { console.error("Error saving name map", e); }

        setIsOtpModalOpen(true);
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Please verify your phone number with the OTP sent.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        otpTimer.startTimer();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: response?.message || 'Registration failed' });
      }
    } catch (error: any) {
      setLoading(false);
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Something went wrong!' });
    }
  };

  const handleOtpConfirm = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("OTP must be exactly 6 digits");
      return;
    }

    try {
      setLoading(true);
      console.log("🔐 [SIGNUP] Confirming OTP:", { phone: sessionUser?.phone, otp });
      const response = await authApi.verifyPhone(sessionUser.phone, otp);
      console.log("📨 [SIGNUP] Verify Response:", response);
      setLoading(false);

      if (response && (response.status === 200 || response.success)) {
        // Robust ID extraction from verification response
        const u = response.data?.user || response.user ||
          response.data?.customer || response.customer ||
          response.data?.data || response.data || {};

        const userId = u.id || u.client_id || u.customer_id || u.user_id ||
          response.id || response.client_id || response.data?.id || null;

        console.log("🆔 [SIGNUP] Extracted User ID:", userId);

        // 4. Extract Avatar URL
        let avatar = u.client_profile_image || u.avatar || response.avatar || null;
        if (avatar && !avatar.startsWith("http")) {
          const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();
          const cleanAvatar = avatar.replace(/^\/*/, "");
          // Check if the backend already included the full storage path, if not, prepend it
          if (cleanAvatar.includes('storage/app/public')) {
            avatar = `${apiBaseUrl}/${cleanAvatar}`;
          } else {
            avatar = `${apiBaseUrl}/storage/app/public/profiles/${cleanAvatar}`;
          }
        }
        console.log("📸 [SIGNUP] Final Avatar URL:", avatar);

        // SUCCESS: Store user data for session persistence
        const userData = {
          ...sessionUser,
          id: userId,
          avatar: avatar,
          token: response.token || response.access_token || null,
          isLoggedIn: true,
          registrationTime: new Date().toISOString()
        };
        localStorage.setItem("rambd_user", JSON.stringify(userData));
        console.log("💾 [SIGNUP] Session Persisted:", userData);

        dispatch({ type: "SET_USER", payload: userData });

        Swal.fire({
          icon: 'success',
          title: 'Verification Successful',
          text: 'Your account has been verified. Please login with the password sent to your SMS.',
        }).then(() => {
          router.push("/login"); // Redirect to Login page per requirements
        });
      } else {
        console.warn("⚠️ [SIGNUP] Verification failed response:", response);
        setOtpError(response?.message || "Invalid OTP");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("❌ [SIGNUP] handleOtpConfirm Error:", error);
      setOtpError(error.message || "Verification failed");
    }
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: formSchema
  });

  return (
    <StyledRoot mx="auto" my="2rem" boxShadow="large" borderRadius={8}>
      <form className="content" onSubmit={handleSubmit}>
        <H3 mb="1.5rem" fontWeight="700">
          Register
        </H3>

        {/* PHONE FIELD */}
        <Box mb="1.25rem">
          <FlexBox alignItems="center" mb="0.5rem">
            <Typography variant="body1" fontWeight="600" color="text.secondary">
              Phone *
            </Typography>
          </FlexBox>
          <FlexBox
            alignItems="center"
            borderRadius="8px"
            style={{
              border: (() => {
                const { color } = validatePhoneNumber(values.phone_digits);
                if (touched.phone_digits && errors.phone_digits) return "1px solid #e74c3c";
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
              value={formatPhoneInput(values.phone_digits)}
              onBlur={handleBlur}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length > 0 && !isValidFirstDigit(val[0])) return;
                setFieldValue("phone_digits", val);
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
            const { message, color } = validatePhoneNumber(values.phone_digits);
            if (touched.phone_digits && errors.phone_digits) {
              return <Typography color="error.main" fontSize="12px" mt="4px">{errors.phone_digits}</Typography>;
            }
            return (
              <Typography color={color} fontSize="12px" mt="4px" fontWeight="600">
                {message}
              </Typography>
            );
          })()}
        </Box>

        {/* NAME FIELD */}
        <Box mb="1.25rem">
          <Typography variant="body1" fontWeight="600" mb="0.5rem">
            Name *
          </Typography>
          <TextField
            fullwidth
            name="name"
            placeholder="Enter Your Name"
            onBlur={handleBlur}
            value={values.name}
            onChange={handleChange}
            errorText={touched.name && errors.name}
          />
        </Box>

        {/* EMAIL FIELD */}
        <Box mb="1.25rem">
          <Typography variant="body1" fontWeight="600" mb="0.5rem">
            Email
          </Typography>
          <TextField
            fullwidth
            name="email"
            type="email"
            placeholder="Enter Your Mail"
            onBlur={handleBlur}
            value={values.email}
            onChange={handleChange}
            errorText={touched.email && errors.email}
          />
        </Box>

        {/* GENDER FIELD */}
        <Box mb="1.25rem">
          <Typography variant="body1" fontWeight="600" mb="0.5rem">
            Gender *
          </Typography>
          <FlexBox gridGap="10px">
            {[{ label: 'Male', value: 1 }, { label: 'Female', value: 2 }, { label: 'Others', value: 3 }].map((g) => (
              <Button
                key={g.value}
                type="button"
                variant={values.gender === g.value ? "contained" : "outlined"}
                color={values.gender === g.value ? "secondary" : "inherit"}
                size="small"
                onClick={() => setFieldValue("gender", g.value)}
                style={{ flex: 1 }}
              >
                {g.label}
              </Button>
            ))}
          </FlexBox>
        </Box>

        {/* DISTRICT & THANA */}
        <Grid container spacing={3} mb="2rem">
          <Grid item sm={6} xs={12}>
            <Typography variant="body1" fontWeight="600" mb="0.5rem">
              District *
            </Typography>
            <Select
              options={districts}
              value={districts.find((d) => d.value === values.district) || ""}
              onChange={(opt: any) => {
                const districtId = opt ? opt.value : "";
                setFieldValue("district", districtId);
                setFieldValue("thana", ""); // Reset thana when district changes
                if (districtId && allThanas.length > 0) {
                  const filtered = allThanas
                    .filter((t: any) => t.district_thana_id === districtId)
                    .map((t: any) => ({ label: t.thana, value: t.id }))
                    .sort((a: any, b: any) => a.label.localeCompare(b.label));
                  setThanas(filtered);
                } else {
                  setThanas([]);
                }
              }}
              placeholder="Select District"
            />
            {touched.district && errors.district && (
              <Typography color="error.main" fontSize="12px" mt="4px">{errors.district}</Typography>
            )}
          </Grid>

          <Grid item sm={6} xs={12}>
            <Typography variant="body1" fontWeight="600" mb="0.5rem">
              Thana *
            </Typography>
            <Select
              options={thanas}
              value={thanas.find((t) => t.value === values.thana) || ""}
              onChange={(opt: any) => setFieldValue("thana", opt ? opt.value : "")}
              placeholder="Select Thana"
              isDisabled={!values.district}
            />
            {touched.thana && errors.thana && (
              <Typography color="error.main" fontSize="12px" mt="4px">{errors.thana}</Typography>
            )}
          </Grid>
        </Grid>

        <FlexBox justifyContent="center" mb="1rem">
          <SemiSpan>Already have account?</SemiSpan>
          <Link href="/login">
            <H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900" color="primary.main">
              Log in
            </H6>
          </Link>
        </FlexBox>

        <Button
          mb="1.65rem"
          variant="contained"
          color="primary"
          type="submit"
          fullwidth
          disabled={loading}
        >
          Register
        </Button>
      </form>

      <Modal open={isOtpModalOpen} onClose={() => { setIsOtpModalOpen(false); setOtp(""); setOtpError(""); }}>
        <Box p="2rem" bg="white" borderRadius="8px" maxWidth="400px" width="100%">
          <H3 textAlign="center" mb="1rem">Verify Your Phone</H3>
          <Box mb="1.5rem" p="12px" borderRadius="8px" bg="gray.100" textAlign="center">
            <SemiSpan color="text.muted" display="block" mb="4px">OTP sent to</SemiSpan>
            <H6 color="text.primary">{sessionUser?.phone || ""}</H6>
          </Box>

          <Box mb="1.5rem">
            <TextField
              fullwidth
              type="tel"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                const input = e.target.value.replace(/[^0-9]/g, "");
                if (input.length <= 6) {
                  setOtp(input);
                  setOtpError("");
                }
              }}
            />
            {otpError && (
              <Typography color="error.main" fontSize="12px" mt="0.5rem">
                {otpError}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullwidth
            onClick={handleOtpConfirm}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
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
                await authApi.generateOtp(sessionUser?.phone);
                setLoading(false);
                otpTimer.startTimer();
                Swal.fire({
                  icon: 'success',
                  title: 'OTP Resent',
                  text: 'Please check your SMS',
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000
                });
              } catch (err) {
                setLoading(false);
                Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to resend OTP' });
              }
            }}
          >
            {otpTimer.isActive ? `Resend OTP in ${otpTimer.formatTime()}` : "Resend OTP"}
          </Button>
        </Box>
      </Modal>
    </StyledRoot>
  );
}
