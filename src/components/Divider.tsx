"use client";

import styled from "styled-components";
import { color, layout, space, ColorProps, LayoutProps, SpaceProps } from "styled-system";
import { isValidProp } from "@utils/utils";

// ==============================================================
type DividerProps = SpaceProps & LayoutProps & ColorProps;
// ==============================================================

const Divider = styled.div.withConfig({
  shouldForwardProp: (prop: string) => isValidProp(prop)
}) <DividerProps>`
  height: 1px;
  background-color: ${({ theme }) =>
    theme && theme.colors && theme.colors.gray ? theme.colors.gray[200] : "#F3F5F9"};
  ${color}
  ${space}
  ${layout}
`;

export default Divider;
