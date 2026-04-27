"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { BorderProps, ColorProps } from "styled-system";
// STYLED COMPONENT
import StyledAvatar from "./styles";

// ==============================================================
export interface AvatarProps extends BorderProps, ColorProps {
  src?: string;
  size?: number;
  children?: ReactNode;
  [key: string]: any;
}
// ==============================================================

export default function Avatar({ src, size = 48, children, ...props }: AvatarProps) {
  return (
    <StyledAvatar size={size} {...props}>
      {src && (
        <Image
          src={src}
          alt="avatar"
          width={size}
          height={size}
          style={{ objectFit: "cover", borderRadius: "50%" }}
          loading="lazy"
        />
      )}
      {!src && children && <span>{children}</span>}
    </StyledAvatar>
  );
}
