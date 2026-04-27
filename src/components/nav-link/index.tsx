"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnchorHTMLAttributes, ReactNode } from "react";
import { CSSProperties } from "styled-components";
import { ColorProps, SpaceProps } from "styled-system";
import StyledNavLink from "./styles";

// ==============================================================
interface NavLinkProps extends SpaceProps, ColorProps {
  as?: string;
  href: string;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}
// ==============================================================

export default function NavLink({
  as,
  href,
  style,
  children,
  className,
  ...props
}: NavLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  let pathname = usePathname();

  const checkRouteMatch = () => {
    if (!pathname || !href) return false;

    // Strict match for home
    if (href === "/") return pathname === href;

    // Normalize paths for comparison (remove leading/trailing slashes, lower case)
    const normalizedPath = pathname.toLowerCase();
    const normalizedHref = href.toLowerCase();

    // Check if path starts with href (good for nested routes) or includes it
    return normalizedPath.includes(normalizedHref);
  };

  return (
    <Link href={href}>
      <StyledNavLink
        style={style}
        className={className}
        isCurrentRoute={checkRouteMatch()}
        {...props}>
        {children}
      </StyledNavLink>
    </Link>
  );
}
