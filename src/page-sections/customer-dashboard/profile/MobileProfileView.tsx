"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Box from "@component/Box";
import Card from "@component/Card";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Typography, { H3 } from "@component/Typography";
import { useAppContext } from "@context/app-context";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${themeGet("colors.gray.200")};
  text-decoration: none;
  color: ${themeGet("colors.text.primary")};
  transition: all 0.2s;

  &:hover {
    background-color: ${themeGet("colors.gray.100")};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  cursor: pointer;
  color: ${themeGet("colors.primary.main")};
  transition: all 0.2s;

  &:hover {
    background-color: ${themeGet("colors.gray.100")};
  }
`;

export default function MobileProfileView() {
    const { state, dispatch } = useAppContext();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !state.user) {
            router.push("/login");
        }
    }, [isMounted, state.user, router]);

    if (!isMounted || !state.user) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("rambd_user");
        dispatch({ type: "LOGOUT" });
        router.push("/login");
    };

    return (
        <Card p="1rem" borderRadius="8px" elevation={3}>
            <FlexBox alignItems="center" mb="2rem" px="1rem">
                <Icon size="2.5rem" mr="1rem" color="primary">user</Icon>
                <Box>
                    <H3 mb="4px">{state.user?.name || "User"}</H3>
                    <Typography color="text.muted" fontSize="14px">{state.user?.phone || ""}</Typography>
                </Box>
            </FlexBox>

            <Box borderRadius="8px" overflow="hidden" style={{ border: "1px solid #F3F5F9" }}>
                <StyledLink href="/profile">
                    <FlexBox alignItems="center">
                        <Icon variant="small" mr="10px" defaultcolor="currentColor">user</Icon>
                        <Typography fontWeight="600">My Profile</Typography>
                    </FlexBox>
                    <Icon size="1rem" defaultcolor="currentColor">chevron-right</Icon>
                </StyledLink>

                <StyledLink href="/orders">
                    <FlexBox alignItems="center">
                        <Icon variant="small" mr="10px" defaultcolor="currentColor">bag</Icon>
                        <Typography fontWeight="600">Order History</Typography>
                    </FlexBox>
                    <Icon size="1rem" defaultcolor="currentColor">chevron-right</Icon>
                </StyledLink>

                <StyledLink href="/profile/change-password">
                    <FlexBox alignItems="center">
                        <Icon variant="small" mr="10px" defaultcolor="currentColor">verify</Icon>
                        <Typography fontWeight="600">Change Password</Typography>
                    </FlexBox>
                    <Icon size="1rem" defaultcolor="currentColor">chevron-right</Icon>
                </StyledLink>

                <LogoutButton onClick={handleLogout}>
                    <FlexBox alignItems="center">
                        <Icon variant="small" mr="10px" defaultcolor="currentColor">arrow-right</Icon>
                        <Typography fontWeight="600">Logout</Typography>
                    </FlexBox>
                    <Icon size="1rem" defaultcolor="currentColor">chevron-right</Icon>
                </LogoutButton>
            </Box>
        </Card>
    );
}
