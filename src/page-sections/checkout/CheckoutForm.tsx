"use client";

import { FC, useEffect, useState } from "react";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import { Card1 } from "@component/Card1";
import Select from "@component/Select";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import Typography, { Paragraph } from "@component/Typography";
import checkoutApi from "@utils/__api__/checkout";
import { useAppContext } from "@context/app-context";

export default function CheckoutForm({ formik }: { formik: any }) {
  const { state } = useAppContext();
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;
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

  useEffect(() => {
    if (values.district && allThanas.length > 0) {
      const filteredThanas = allThanas
        .filter((t: any) => t.district_thana_id === values.district)
        .map((t: any) => ({ label: t.thana, value: t.id }))
        .sort((a: any, b: any) => a.label.localeCompare(b.label));
      setThanas(filteredThanas);

      // Fetch shipping cost
      const fetchShipping = async () => {
        const isAllFree = state.cart.length > 0 && state.cart.every((item: any) => item.delivery_charge === 1);

        if (isAllFree) {
          console.log("🚚 All items have free delivery. Setting shipping cost to 0.");
          setFieldValue("shipping_cost", 0);
          return;
        }

        console.log("🚚 Fetching shipping cost for district:", values.district);
        const costData = await checkoutApi.getShippingCost(values.district);
        console.log("📦 Shipping cost API response:", costData);
        if (costData && costData.success && costData.data && costData.data.price) {
          console.log("✅ Setting shipping_cost to:", Number(costData.data.price));
          setFieldValue("shipping_cost", Number(costData.data.price));
        } else {
          console.log("❌ Shipping cost not found in response, setting default 130");
          setFieldValue("shipping_cost", 130);
        }
      };
      fetchShipping();
    } else {
      setThanas([]);
    }
  }, [values.district, allThanas, setFieldValue, state.cart]);

  return (
    <Card1 mb="2rem">
      <Typography fontWeight="700" mb="0.5rem" fontSize="20px">
        Billing Info
      </Typography>
      <Paragraph color="text.muted" mb="1.5rem">
        Add your billing information
      </Paragraph>

      <Box mb="1.5rem">
        <Typography fontWeight="600" mb="0.5rem" fontSize="14px">
          Phone
        </Typography>
        <FlexBox
          alignItems="center"
          borderRadius="8px"
          style={{
            border: (() => {
              const raw = (values.phone || "").replace(/\+8801/, "");
              if (raw.length === 9) return "1px solid #2ba56d";
              if (raw.length > 0) return "1px solid #e74c3c";
              if (touched.phone && errors.phone) return "1px solid #e74c3c";
              return "1px solid #dee2e6";
            })(),
            overflow: "hidden"
          }}
        >
          <Box
            bg="gray.200"
            px="12px"
            py="10px"
            style={{
              borderRight: "1px solid #dee2e6",
              whiteSpace: "nowrap",
              userSelect: "none"
            }}
          >
            <Typography fontSize="18px" fontWeight="700" color="text.primary">
              +8801
            </Typography>
          </Box>
          <input
            name="phone_digits"
            type="tel"
            maxLength={10}
            value={(() => {
              const raw = (values.phone || "").replace(/\+8801/, "").replace(/-/g, "");
              if (raw.length > 5) return raw.slice(0, 5) + "-" + raw.slice(5);
              return raw;
            })()}
            onBlur={handleBlur}
            onChange={async (e) => {
              const input = e.target.value.replace(/[^0-9]/g, "");

              // Validation: First digit must be 3-9
              if (input.length > 0) {
                const firstDigit = parseInt(input[0]);
                if (firstDigit < 3) {
                  return; // Block 0, 1, 2
                }
              }

              if (input.length <= 9) {
                const fullPhone = input ? `+8801${input}` : "";
                setFieldValue("phone", fullPhone);

                // Auto-fill trigger when phone is complete (9 digits after +8801)
                if (input.length === 9) {
                  try {
                    const userData = await checkoutApi.getUserByPhone(fullPhone);
                    if (userData && userData.success && userData.data) {
                      const user = userData.data;
                      if (user.name) setFieldValue("full_name", user.name);
                      if (user.address) setFieldValue("address", user.address);

                      // Auto-fill district and thana
                      if (user.district_id) {
                        const districtId = String(user.district_id);
                        const districtObj = districts.find((d) => String(d.value) === districtId);

                        if (districtObj) {
                          setFieldValue("district", districtObj.value);
                          setFieldValue("district_name", districtObj.label);

                          // Only attempt to set thana if district matches
                          if (user.thana_id) {
                            const thanaId = String(user.thana_id);
                            // We need to wait for thanas to be filtered by the useEffect,
                            // but since we are in an event handler, we might need to filter manually
                            // to find the label for the thana_name field.
                            const filteredThanas = allThanas
                              .filter((t: any) => String(t.district_thana_id) === districtId);

                            const thanaObj = filteredThanas.find((t: any) => String(t.id) === thanaId);

                            if (thanaObj) {
                              setFieldValue("thana", thanaObj.id);
                              setFieldValue("thana_name", thanaObj.thana);
                            }
                          }
                        }
                      }
                    }
                  } catch (err) {
                    console.error("Auto-fill error", err);
                  }
                }
              }
            }}
            placeholder="XXXXX-XXXX"
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              padding: "10px 12px",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "2px",
              fontFamily: "inherit",
              background: "transparent"
            }}
          />
        </FlexBox>
        {/* Real-time validation feedback */}
        {(() => {
          const raw = (values.phone || "").replace(/\+8801/, "");
          if (raw.length === 9) {
            return (
              <Typography fontSize="12px" color="success.main" mt="4px" fontWeight="600">
                ✓ Valid phone number
              </Typography>
            );
          }
          if (raw.length > 0 && raw.length < 9) {
            return (
              <Typography fontSize="12px" mt="4px" fontWeight="600" style={{ color: "#e74c3c" }}>
                ⚠ Enter {9 - raw.length} more digit{9 - raw.length > 1 ? "s" : ""} to complete the number
              </Typography>
            );
          }
          if (touched.phone && errors.phone) {
            return (
              <Typography fontSize="12px" mt="4px" fontWeight="600" style={{ color: "#e74c3c" }}>
                {errors.phone}
              </Typography>
            );
          }
          return null;
        })()}
      </Box>

      <Box mb="1.5rem">
        <Typography fontWeight="600" mb="0.5rem" fontSize="14px">
          Name *
        </Typography>
        <TextField
          fullwidth
          name="full_name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.full_name}
          errorText={touched.full_name && errors.full_name}
          placeholder="Enter Your Name"
        />
      </Box>

      <Grid container spacing={3} mb="1.5rem">
        <Grid item sm={6} xs={12}>
          <Typography fontWeight="600" mb="0.5rem" fontSize="14px">
            District
          </Typography>
          <Select
            id="district-select"
            isSearchable={true}
            isClearable={true}
            options={districts}
            value={districts.find((d) => d.value === values.district) || ""}
            errorText={touched.district && errors.district}
            onChange={(district: any) => {
              setFieldValue("district", district ? district.value : "");
              setFieldValue("district_name", district ? district.label : "");
              setFieldValue("thana", ""); // Reset thana when district changes
              setFieldValue("thana_name", ""); // Reset thana name
            }}
            placeholder="Select District"
          />
        </Grid>

        <Grid item sm={6} xs={12}>
          <Typography fontWeight="600" mb="0.5rem" fontSize="14px">
            Thana
          </Typography>
          <Select
            id="thana-select"
            isSearchable={true}
            isClearable={true}
            options={thanas}
            value={thanas.find((d) => d.value === values.thana) || ""}
            errorText={touched.thana && errors.thana}
            onChange={(thana: any) => {
              setFieldValue("thana", thana ? thana.value : "");
              setFieldValue("thana_name", thana ? thana.label : "");
            }}
            placeholder="Select Thana"
            isDisabled={thanas.length === 0}
          />
        </Grid>
      </Grid>

      <Box mb="1.5rem">
        <Typography fontWeight="600" mb="0.5rem" fontSize="14px">
          Address
        </Typography>
        <TextField
          fullwidth
          multiline
          rows={4}
          name="address"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.address}
          errorText={touched.address && errors.address}
          placeholder="Enter your full address here"
        />
      </Box>

      <Box mb="0.5rem">
        <Typography fontWeight="600" mb="0.5rem" fontSize="14px">
          Special Note
        </Typography>
        <TextField
          fullwidth
          multiline
          rows={4}
          name="special_note"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.special_note}
          errorText={touched.special_note && errors.special_note}
          placeholder="Enter any special instructions for your order"
          style={{ marginBottom: "5px" }}
        />
        <FlexBox justifyContent="space-between" alignItems="center">
          <Typography fontSize="12px" color="text.hint">
            Max 250 character
          </Typography>
          <Typography fontSize="12px" color="text.hint">
            {values.special_note?.length || 0}/250
          </Typography>
        </FlexBox>
      </Box>
    </Card1>
  );
}
