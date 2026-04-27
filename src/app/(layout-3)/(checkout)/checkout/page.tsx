"use client";

import { useRouter } from "next/navigation";
import * as yup from "yup";
import { Formik } from "formik";
// GLOBAL CUSTOM COMPONENTS
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Modal from "@component/Modal";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Icon from "@component/icon/Icon";
import TextField from "@component/text-field";
import Typography, { Span } from "@component/Typography";
// PAGE SECTION COMPONENTS
import CheckoutForm from "@sections/checkout/CheckoutForm";
import CheckoutSummary from "@sections/checkout/CheckoutSummary";
// CUSTOM HOOK
import { useAppContext } from "@context/app-context";
import checkoutApi from "@utils/__api__/checkout";
import { useState, useEffect } from "react";
import { useOtpTimer } from "@hook/useOtpTimer";

import Swal from "sweetalert2";

import Container from "@component/Container";

export default function Checkout() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [orderPayload, setOrderPayload] = useState<any>(null);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhoneDigits, setNewPhoneDigits] = useState("");
  const expiryTimer = useOtpTimer("checkout_expiry", 300);
  const resendTimer = useOtpTimer("checkout_resend", 60);
  const [isMounted, setIsMounted] = useState(false);
  const [cartSettled, setCartSettled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Give localStorage cart restoration a tick to settle before checking empty
    const t = setTimeout(() => setCartSettled(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleFormSubmit = async (values: any) => {
    // scale payload
    const orderData = {
      order_details: {
        ord_name: values.full_name,
        ord_phone: values.phone,
        email: "",
        ord_note: values.special_note,
        shipping_cost: values.shipping_cost,
        ord_address: values.address,
        district_id: values.district,
        district_name: values.district_name,
        thana_id: values.thana,
        thana_name: values.thana_name,
        payment_method: values.payment_method
      },
      product_details: state.cart.map((item) => ({
        id: item.id,
        product_qty: item.qty,
        sale_price: item.price,
        original_price: item.regularPrice || item.originalPrice || item.price,
        product_total_price: item.price * item.qty
      })),
      is_emi_available: "0"
    };

    setOrderPayload(orderData);

    // Generate OTP
    setLoading(true);
    const otpResponse = await checkoutApi.generateOtp(values.phone);
    setLoading(false);
    console.log("OTP Response received in Page:", otpResponse);

    if (otpResponse && (otpResponse.status || otpResponse.success)) {
      setIsOtpModalOpen(true);
      expiryTimer.startTimer();
      Swal.fire({
        icon: 'success',
        title: 'OTP Sent',
        text: 'OTP sent to your phone number.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to generate OTP. Please try again.'
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const otpResponse = await checkoutApi.generateOtp(orderPayload.order_details.ord_phone);
      setLoading(false);

      if (otpResponse && (otpResponse.status || otpResponse.success)) {
        expiryTimer.startTimer();
        resendTimer.startTimer();
        Swal.fire({
          icon: 'success',
          title: 'OTP Resent',
          text: 'A new OTP has been sent to your phone.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to resend OTP. Please try again.'
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong!' });
    }
  };

  const handleOtpConfirm = async () => {
    // Clear previous errors
    setOtpError("");

    // Validate OTP format
    if (!otp) {
      setOtpError("Please enter the OTP");
      return;
    }

    if (!/^\d+$/.test(otp)) {
      setOtpError("OTP must contain only numbers");
      return;
    }

    if (otp.length !== 6) {
      setOtpError("OTP must be exactly 6 digits");
      return;
    }

    setLoading(true);
    const finalPayload = { ...orderPayload, otp };

    console.log("🔐 Submitting OTP:", otp);
    console.log("📦 Final Payload:", JSON.stringify(finalPayload, null, 2));

    const response = await checkoutApi.placeOrder(finalPayload);

    console.log("📨 API Response:", response);

    if (response && response.success) {
      console.log("✅ Order placed successfully! Response:", response);
      dispatch({ type: "RESTORE_CART", payload: [] });
      localStorage.removeItem("cart");

      // Store both the order response AND the form data for the invoice page
      console.log("finalPayload structure:", finalPayload);

      const totalPrice = state.cart.reduce((accum, item) => accum + (item.price * item.qty), 0);
      const totalOriginalPrice = state.cart.reduce((accum, item) => accum + ((item.regularPrice || item.originalPrice || item.price) * item.qty), 0);
      const totalDiscount = totalOriginalPrice - totalPrice;

      const completeOrderData = {
        ...response,
        form_data: {
          customer_name: finalPayload.order_details.ord_name,
          phone: finalPayload.order_details.ord_phone,
          address: finalPayload.order_details.ord_address,
          district_name: finalPayload.order_details.district_name,
          thana_name: finalPayload.order_details.thana_name,
          shipping_cost: finalPayload.order_details.shipping_cost,
          total_discount: totalDiscount,
          payment_method: finalPayload.order_details.payment_method
        },
        products: state.cart.map(item => ({
          id: item.id,
          product_qty: item.qty,
          sale_price: item.price,
          product_name: item.name || "Product",
          product_img: item.imgUrl || ""
        }))
      };
      sessionStorage.setItem("lastOrderData", JSON.stringify(completeOrderData));
      console.log("✅ Stored order data in sessionStorage:", completeOrderData);

      setIsOtpModalOpen(false);
      setOtp("");
      setOtpError("");

      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'Your order has been successfully placed.',
        showConfirmButton: true,
        confirmButtonText: 'OK'
      }).then(() => {
        router.push("/order-success");
      });
    } else {
      // Handle API errors (including incorrect OTP)
      console.error("❌ API Error Response:", response);
      const errorMessage = response?.message || "Failed to place order. Please try again.";

      // Check if it's an OTP validation error
      if (errorMessage.toLowerCase().includes("otp") ||
        errorMessage.toLowerCase().includes("verification") ||
        errorMessage.toLowerCase().includes("invalid") ||
        errorMessage.toLowerCase().includes("incorrect") ||
        errorMessage.toLowerCase().includes("wrong") ||
        errorMessage.toLowerCase().includes("expire") ||
        errorMessage.toLowerCase().includes("match")) {
        setOtpError(errorMessage);
      } else {
        Swal.fire('Error', errorMessage, 'error');
      }
    }
    setLoading(false);
  };

  if (isMounted && cartSettled && state.cart.length === 0) {
    return (
      <Box mb="2rem" textAlign="center" mt="4rem">
        <Typography fontSize="28px" fontWeight="700" mb="1rem">
          Your cart is empty
        </Typography>
        <Typography fontSize="16px" color="text.muted" mb="2rem">
          Please add some items to your cart to proceed with checkout.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box mb="2rem">
      <FlexBox alignItems="center" mb="1.5rem" mt="1rem">
        <Button
          color="primary"
          variant="outlined"
          px="20px"
          mr="1rem"
          onClick={() => router.back()}
          style={{ height: "40px", fontWeight: 700 }}
        >
          <Icon variant="small" mr="8px">
            arrow-left
          </Icon>
          Go Back
        </Button>

        <Box>
          <Typography fontSize="14px" color="text.muted" mb="0.5rem">
            <Span color="primary.main">🏠</Span> / Checkout
          </Typography>
        </Box>
      </FlexBox>

      <Box mb="2rem">
        <Typography fontSize="28px" fontWeight="700" mb="0.5rem">
          Complete Checkout Process
        </Typography>
        <Typography fontSize="16px" color="text.muted">
          Get our <Span color="primary.main" fontWeight="600">Provide you delivery destination & get the product with super fast delivery</Span>
        </Typography>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {(formik) => (
          <Grid container spacing={6}>
            <Grid item lg={8} md={8} xs={12}>
              <CheckoutForm formik={formik} />
            </Grid>

            <Grid item lg={4} md={4} xs={12}>
              <CheckoutSummary formik={formik} />
            </Grid>
          </Grid>
        )}
      </Formik>

      <Modal
        open={isOtpModalOpen}
        closeOnBackdropClick={false}
        onClose={() => {
          setIsOtpModalOpen(false);
          setIsEditingPhone(false);
          setNewPhoneDigits("");
          setOtp("");
          setOtpError("");
        }}
      >
        <Box p="2rem" bg="white" borderRadius="8px" maxWidth="400px" width="100%" position="relative" style={{ boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" }}>
          {/* Close Button */}
          <Box
            position="absolute"
            top="-12px"
            right="-12px"
            cursor="pointer"
            zIndex={1001}
            onClick={(e) => {
              e.stopPropagation();
              setIsOtpModalOpen(false);
              setIsEditingPhone(false);
              setNewPhoneDigits("");
              setOtp("");
              setOtpError("");
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="32px"
            height="32px"
            borderRadius="50%"
            bg="primary.main"
            style={{
              transition: "all 0.2s",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)"
            }}
          >
            ✕
          </Box>

          <Typography fontSize="22px" fontWeight="700" mb="1rem" textAlign="center">
            Verify Your Phone
          </Typography>

          {/* Show current phone number */}
          <Box mb="1.5rem" p="12px" borderRadius="8px" bg="gray.100" textAlign="center">
            <Typography fontSize="13px" color="text.muted" mb="4px">
              OTP sent to
            </Typography>
            <Typography fontSize="18px" fontWeight="700" color="text.primary">
              {orderPayload?.order_details?.ord_phone || ""}
            </Typography>
            {!isEditingPhone && (
              <Typography
                fontSize="13px"
                fontWeight="600"
                color="primary.main"
                mt="6px"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => {
                  const currentPhone = orderPayload?.order_details?.ord_phone || "";
                  setNewPhoneDigits(currentPhone.replace(/\+8801/, ""));
                  setIsEditingPhone(true);
                }}
              >
                Change Number
              </Typography>
            )}
          </Box>

          {/* Inline phone editor */}
          {isEditingPhone && (
            <Box mb="1.5rem">
              <Typography fontSize="13px" fontWeight="600" mb="6px" color="text.muted">
                Enter new phone number:
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                borderRadius="8px"
                mb="8px"
                style={{
                  border: newPhoneDigits.length === 9 ? "1px solid #2ba56d" : newPhoneDigits.length > 0 ? "1px solid #e74c3c" : "1px solid #dee2e6",
                  overflow: "hidden"
                }}
              >
                <Box
                  bg="gray.200"
                  px="10px"
                  py="8px"
                  style={{ borderRight: "1px solid #dee2e6", whiteSpace: "nowrap", userSelect: "none" }}
                >
                  <Typography fontSize="16px" fontWeight="700" color="text.primary">
                    +8801
                  </Typography>
                </Box>
                <input
                  type="tel"
                  maxLength={10}
                  value={newPhoneDigits.length > 5 ? newPhoneDigits.slice(0, 5) + "-" + newPhoneDigits.slice(5) : newPhoneDigits}
                  onChange={(e) => {
                    const input = e.target.value.replace(/[^0-9]/g, "");
                    if (input.length <= 9) setNewPhoneDigits(input);
                  }}
                  placeholder="XXXXX-XXXX"
                  style={{
                    border: "none", outline: "none", width: "100%",
                    padding: "8px 10px", fontSize: "18px", fontWeight: 700,
                    letterSpacing: "2px", fontFamily: "inherit", background: "transparent"
                  }}
                />
              </Box>
              {newPhoneDigits.length > 0 && newPhoneDigits.length < 9 && (
                <Typography fontSize="11px" fontWeight="600" style={{ color: "#e74c3c" }}>
                  ⚠ {9 - newPhoneDigits.length} more digit{9 - newPhoneDigits.length > 1 ? "s" : ""} needed
                </Typography>
              )}
              <Box display="flex" style={{ gap: 8 }} mt="8px">
                <Button
                  variant="contained"
                  color="primary"
                  fullwidth
                  size="small"
                  disabled={newPhoneDigits.length !== 9 || loading}
                  onClick={async () => {
                    const newPhone = `+8801${newPhoneDigits}`;
                    setLoading(true);
                    const otpResponse = await checkoutApi.generateOtp(newPhone);
                    setLoading(false);
                    if (otpResponse && (otpResponse.status || otpResponse.success)) {
                      // Update payload with new phone
                      setOrderPayload((prev: any) => ({
                        ...prev,
                        order_details: { ...prev.order_details, ord_phone: newPhone }
                      }));
                      setIsEditingPhone(false);
                      setOtp("");
                      expiryTimer.startTimer();
                      resendTimer.startTimer();
                      Swal.fire({ icon: 'success', title: 'OTP Sent', text: `OTP sent to ${newPhone}`, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
                    } else {
                      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to send OTP to new number.' });
                    }
                  }}
                >
                  {loading ? "Sending..." : "Send OTP to New Number"}
                </Button>
                <Button
                  variant="outlined"
                  color="dark"
                  size="small"
                  onClick={() => { setIsEditingPhone(false); setNewPhoneDigits(""); }}
                  style={{ whiteSpace: "nowrap" }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}

          <Box mb="1.5rem">
            <TextField
              fullwidth
              type="tel"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                const input = e.target.value.replace(/[^0-9]/g, "");
                if (input.length <= 6) {
                  setOtp(input);
                  setOtpError(""); // Clear error when user types
                }
              }}
              style={{
                borderColor: otpError ? "#e74c3c" : undefined,
                borderWidth: otpError ? "2px" : undefined
              }}
            />
            <FlexBox justifyContent="space-between" mt="8px">
              <Typography fontSize="12px" fontWeight="600" color={expiryTimer.isActive ? "text.muted" : "#e74c3c"}>
                {expiryTimer.isActive ? `OTP expires in: ${expiryTimer.formatTime()}` : "OTP has expired"}
              </Typography>
              {otpError && (
                <Typography fontSize="12px" fontWeight="600" color="#e74c3c">
                  ⚠ {otpError}
                </Typography>
              )}
            </FlexBox>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullwidth
            onClick={handleOtpConfirm}
            disabled={loading}
            mb="1rem"
          >
            {loading ? "Confirming..." : "Confirm & Place Order"}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            fullwidth
            onClick={handleResendOtp}
            disabled={resendTimer.isActive || loading}
          >
            {resendTimer.isActive ? `Resend OTP in ${resendTimer.formatTime()}` : "Resend OTP"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

const initialValues = {
  phone: "",
  full_name: "",
  district: "",
  district_name: "",
  thana: "",
  thana_name: "",
  address: "",
  special_note: "",
  payment_method: "cod",
  agree: false,
  shipping_cost: 0
};

const checkoutSchema = yup.object().shape({
  full_name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone is required").matches(/^\+8801\d{9}$/, "Enter a valid 11-digit BD phone number"),
  district: yup.string().required("District is required"),
  thana: yup.string().required("Thana is required"),
  address: yup.string().required("Address is required"),
  agree: yup.bool().oneOf([true], "You must agree to the terms and conditions")
});
