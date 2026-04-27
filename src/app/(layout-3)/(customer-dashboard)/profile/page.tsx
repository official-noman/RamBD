"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Box from "@component/Box";
import { Card1 } from "@component/Card1";
import Avatar from "@component/avatar";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import Typography, { H3, H5, Small } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { EditProfileButton } from "@sections/customer-dashboard/profile";
import { useAppContext } from "@context/app-context";
import Container from "@component/Container";

export default function Profile() {
  const { state } = useAppContext();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const user = state.user || {};

  return (
    <Container py="2rem">
      <DashboardPageHeader
        iconName="user_filled"
        title="My Profile"
        button={<EditProfileButton />}
      />

      <Box mb="30px">
        <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <FlexBox as={Card1} p="14px 32px" height="100%" alignItems="center">
              <Avatar src={user.avatar || "/assets/images/faces/propic.png"} size={64} />
              <Box ml="12px" flex="1 1 0">
                <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center">
                  <div>
                    <H5 my="0px">{user.name || "User"}</H5>
                  </div>

                  <Typography color="text.muted" letterSpacing="0.2em">
                    RAMBD USER
                  </Typography>
                </FlexBox>
              </Box>
            </FlexBox>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Grid container spacing={4}>
              <Grid item lg={6} sm={6} xs={6}>
                <Card1
                  display="flex"
                  p="14px 32px"
                  height="100%"
                  alignItems="center"
                  flexDirection="column"
                  justifyContent="center">
                  <H3 color="primary.main" my="0px" fontWeight="600">
                    {/* Just a placeholder metric */}
                    16
                  </H3>

                  <Small color="text.muted" textAlign="center">
                    All Orders
                  </Small>
                </Card1>
              </Grid>

              <Grid item lg={6} sm={6} xs={6}>
                <Card1
                  display="flex"
                  p="14px 32px"
                  height="100%"
                  alignItems="center"
                  flexDirection="column"
                  justifyContent="center">
                  <H3 color="primary.main" my="0px" fontWeight="600">
                    {/* Placeholder metric */}
                    02
                  </H3>

                  <Small color="text.muted" textAlign="center">
                    Awaiting Payments
                  </Small>
                </Card1>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Card1 p="30px">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ paddingBottom: "1rem" }}>
                <Small color="text.muted" mb="4px" display="block">
                  Full Name
                </Small>
                <span>{user.name || "-"}</span>
              </td>
              <td style={{ paddingBottom: "1rem" }}>
                <Small color="text.muted" mb="4px" display="block">
                  Email URL
                </Small>
                <span>{user.email || "-"}</span>
              </td>
            </tr>
            <tr>
              <td>
                <Small color="text.muted" mb="4px" display="block">
                  Phone Number
                </Small>
                <span>{user.phone || "-"}</span>
              </td>
              <td>
                {/* Blank space to maintain layout */}
              </td>
            </tr>
          </tbody>
        </table>
      </Card1>
    </Container>
  );
}
