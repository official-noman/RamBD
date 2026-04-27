"use client";

import styled from "styled-components";
import {
  color,
  space,
  border,
  layout,
  flexbox,
  SpaceProps,
  ColorProps,
  BorderProps,
  LayoutProps,
  FlexboxProps,
  GridGapProps
} from "styled-system";

import Box from "./Box";
import { isValidProp } from "@utils/utils";

// ==============================================================
type Props = FlexboxProps & LayoutProps & SpaceProps & ColorProps & BorderProps & GridGapProps;
// ==============================================================

const FlexBox = styled(Box).withConfig({
  shouldForwardProp: (prop: string) => isValidProp(prop)
})<Props>`
  display: flex;
  flex-direction: row;
  ${color}
  ${space}
  ${layout}
  ${border}
  ${flexbox}
`;

export default FlexBox;
