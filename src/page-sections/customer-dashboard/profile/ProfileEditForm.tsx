"use client";
import * as yup from "yup";
import { Formik } from "formik";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";

import Box from "@component/Box";
import Hidden from "@component/hidden";
import Avatar from "@component/avatar";
import Icon from "@component/icon/Icon";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import { useAppContext } from "@context/app-context";
import { useRouter } from "next/navigation";

export default function ProfileEditForm() {
  const { state, dispatch } = useAppContext();
  const router = useRouter();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    state.user?.avatar || "/assets/images/faces/propic.png"
  );
  const [loading, setLoading] = useState(false);

  // If user is not ready yet, we can either return null or empty form
  const user = state.user || {};

  const INITIAL_VALUES = {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || ""
  };

  const VALIDATION_SCHEMA = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email"),
    phone: yup.string().required("Phone is required")
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (values: typeof INITIAL_VALUES) => {
    if (!user.id) {
      Swal.fire("Error", "User not logged in or missing ID", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);

      if (profileImage) {
        formData.append("client_profile_image", profileImage);
      }

      const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();
      const response = await fetch(`${apiBaseUrl}/client/update-profile/${user.id}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok || data.success) {
        let newAvatarUrl = user.avatar;

        // Extract avatar URL from different possible API response structures
        if (data.user_info?.client_profile_image) newAvatarUrl = data.user_info.client_profile_image;
        else if (data.client_profile_image) newAvatarUrl = data.client_profile_image;
        else if (data.data?.client_profile_image) newAvatarUrl = data.data.client_profile_image;
        else if (data.avatar) newAvatarUrl = data.avatar;

        if (newAvatarUrl && !newAvatarUrl.startsWith("http")) {
          const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();
          const cleanAvatar = newAvatarUrl.replace(/^\/*/, "");
          // Check if the backend already included the full storage path, if not, prepend it
          if (cleanAvatar.includes('storage/app/public')) {
            newAvatarUrl = `${apiBaseUrl}/${cleanAvatar}`;
          } else {
            newAvatarUrl = `${apiBaseUrl}/storage/app/public/profiles/${cleanAvatar}`;
          }
        }
        console.log("📸 [PROFILE-UPDATE] API Data:", data);
        console.log("📸 [PROFILE-UPDATE] Final Avatar URL:", newAvatarUrl);

        // Update user state and localStorage
        const updatedUser = {
          ...user,
          name: values.name,
          phone: values.phone,
          email: values.email,
          avatar: newAvatarUrl
        };
        dispatch({ type: "SET_USER", payload: updatedUser });
        localStorage.setItem("rambd_user", JSON.stringify(updatedUser));

        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully!",
        }).then(() => {
          router.push("/profile");
        });
      } else {
        Swal.fire("Error", data.message || "Failed to update profile", "error");
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", error.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FlexBox alignItems="flex-end" mb="22px">
        <Avatar src={imagePreview} size={64} />

        <Box ml="-20px" zIndex={1}>
          <label htmlFor="profile-image">
            <Button
              p="6px"
              as="span"
              size="small"
              height="auto"
              bg="gray.300"
              color="secondary"
              borderRadius="50%">
              <Icon>camera</Icon>
            </Button>
          </label>
        </Box>

        <Hidden>
          <input
            type="file"
            accept="image/*"
            id="profile-image"
            onChange={handleImageChange}
          />
        </Hidden>
      </FlexBox>

      <Formik
        enableReinitialize
        onSubmit={handleFormSubmit}
        initialValues={INITIAL_VALUES}
        validationSchema={VALIDATION_SCHEMA}>
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box mb="30px">
              <Grid container horizontal_spacing={6} vertical_spacing={4}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullwidth
                    name="name"
                    label="Full Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    errorText={touched.name && errors.name}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullwidth
                    name="email"
                    type="email"
                    label="Email"
                    onBlur={handleBlur}
                    value={values.email}
                    onChange={handleChange}
                    errorText={touched.email && errors.email}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullwidth
                    label="Phone"
                    name="phone"
                    onBlur={handleBlur}
                    value={values.phone}
                    onChange={handleChange}
                    errorText={touched.phone && errors.phone}
                  />
                </Grid>
              </Grid>
            </Box>

            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        )}
      </Formik>
    </>
  );
}
