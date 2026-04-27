"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import MiniCart from "@component/mini-cart";
import { H3, Tiny, Small } from "@component/Typography";
import { IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import { SearchInputWithCategory } from "@component/search-box";
import { useAppContext } from "@context/app-context";
import Menu from "@component/Menu";
import MenuItem from "@component/MenuItem";
import MobileNavSidebar from "./MobileNavSidebar";
import StyledHeader from "./styles";

// ====================================================================
type HeaderProps = { isFixed?: boolean; className?: string };
// =====================================================================

export default function Header({ className }: HeaderProps) {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidenav = () => dispatch({ type: "TOGGLE_CART" });

  const handleLogout = () => {
    localStorage.removeItem("rambd_user");
    dispatch({ type: "LOGOUT" });
    router.push("/login");
  };

  const CART_HANDLE = (
    <FlexBox ml="20px" alignItems="flex-start">
      <IconButton bg="gray.200" p="12px">
        <Icon size="20px">bag</Icon>
      </IconButton>
      {isMounted && !!state.cart.length && (
        <FlexBox px="5px" py="2px" mt="-9px" ml="-1rem" bg="primary.main"
          alignItems="center" borderRadius="300px" justifyContent="center">
          <Tiny color="white" fontWeight="600">
            {state.cart.reduce((acc, item) => acc + item.qty, 0)}
          </Tiny>
        </FlexBox>
      )}
    </FlexBox>
  );

  const LOGIN_HANDLE = (
    <FlexBox alignItems="center" ml="1rem" style={{ cursor: "pointer" }}>
      <IconButton bg="gray.200" p="8px">
        <Icon size="28px">user</Icon>
      </IconButton>
      <Small fontWeight="600" ml="10px" color="text.secondary">
        Sign In
      </Small>
    </FlexBox>
  );

  return (
    <StyledHeader className={className}>
      <div className="rb-nav-row">
        {/* LOGO */}
        <Link href="/" className="rb-logo-wrap">
          <Image
            src="/assets/images/rambd_logo.webp"
            alt="RamBD Logo"
            width={60}
            height={60}
            priority
            unoptimized
            className="rb-logo-img"
          />
          <H3 color="primary.main" className="rb-logo-text">
            Ram<span style={{ color: "#27ae60" }}>BD</span>
          </H3>
        </Link>

        {/* SEARCH */}
        <div className="rb-search">
          <SearchInputWithCategory />
        </div>

        {/* DESKTOP SECTION */}
        <div className="rb-desktop">
          {isMounted && state.user ? (
            <Menu
              direction="right"
              handler={
                <FlexBox alignItems="center" style={{ cursor: "pointer" }} ml="1rem">
                  <IconButton bg="gray.200" p="4px" style={{ overflow: "hidden", width: "44px", height: "44px" }}>
                    {state.user?.avatar ? (
                      <img
                        src={state.user.avatar}
                        alt="User"
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <Icon size="28px">user</Icon>
                    )}
                  </IconButton>
                  {state.user?.name && (
                    <Small fontWeight="600" ml="10px" color="text.secondary">
                      {state.user.name}
                    </Small>
                  )}
                </FlexBox>
              }>
              <Link href="/profile">
                <MenuItem>My Profile</MenuItem>
              </Link>
              <Link href="/orders">
                <MenuItem>Order History</MenuItem>
              </Link>
              <Link href="/profile/change-password">
                <MenuItem>Change Password</MenuItem>
              </Link>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          ) : (
            <Link href="/login">
              {LOGIN_HANDLE}
            </Link>
          )}

          <Sidenav
            open={state.isCartOpen}
            width={380}
            position="right"
            handle={CART_HANDLE}
            toggleSidenav={toggleSidenav}
          >
            <MiniCart toggleSidenav={toggleSidenav} />
          </Sidenav>
        </div>


        {/* MOBILE PROFILE (AVATAR) */}
        {isMounted && (
          <div className="rb-mobile-profile">
            {state.user ? (
              <Link href="/profile">
                <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {state.user.avatar ? (
                    <img src={state.user.avatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Icon size="20px">user</Icon>
                  )}
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size="20px">user</Icon>
                </div>
              </Link>
            )}
          </div>
        )}

        {/* MOBILE HAMBURGER */}
        <button
          className="rb-hamburger"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <MobileNavSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </StyledHeader>
  );
}
