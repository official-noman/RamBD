import { InputHTMLAttributes, useEffect, useState } from "react";
import styled from "styled-components";
import { color, compose, space, SpaceProps } from "styled-system";
import systemCss from "@styled-system/css";

import { colorOptions } from "../interfaces";
import { isValidProp } from "@utils/utils";

// ==============================================================
type CheckBoxProps = {
  color?: colorOptions;
  labelColor?: colorOptions;
  labelPlacement?: "start" | "end";
  label?: any;
  id?: any;
  size?: number;
};
// ==============================================================

type WrapperProps = { labelPlacement?: "start" | "end" };

const StyledCheckBox = styled.input.withConfig({
  shouldForwardProp: (prop: string) => isValidProp(prop)
})<CheckBoxProps & InputHTMLAttributes<HTMLInputElement>>(
  ({ color, size }) =>
    systemCss({
      /* remove standard background appearance */
      // "-webkit-appearance": "none",
      // "-moz-appearance": "none",
      // "-webkit-user-select": "none",
      // "-moz-user-select": "none",
      // "-ms-user-select": "none",
      // "user-select": "none",
      appearance: "none",
      outline: "none",
      cursor: "pointer",
      margin: 0,
      width: size || 18,
      height: size || 18,
      flexShrink: 0,
      border: "1px solid",
      borderColor: "#2ba56d",
      borderRadius: 2,
      position: "relative",

      /* appearance for checked checkbox */
      "&:checked": {
        borderColor: "#2ba56d",
        backgroundColor: "transparent",
      },

      "&:after": {
        content: "' '",
        position: "absolute",
        display: "none",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -60%) rotate(45deg)",
        width: "6px",
        height: "12px",
        border: "solid #2ba56d",
        borderWidth: "0 3px 3px 0",
      },

      "&:checked:after": {
        display: "block",
      },

      "&:disabled": {
        borderColor: `text.disabled`,
        backgroundColor: "transparent",
      },

      "&:checked:disabled": {
        borderColor: `text.disabled`,
      }
    }),
  compose(color)
);

const Wrapper = styled.div.withConfig({
  shouldForwardProp: (prop: string) => isValidProp(prop)
}) <WrapperProps & SpaceProps>`
  display: flex;
  align-items: center;
  flex-direction: ${(props) => (props.labelPlacement !== "end" ? "row" : "row-reverse")};
  input {
    ${(props) => (props.labelPlacement !== "end" ? "margin-right: 0.5rem" : "margin-left: 0.5rem")};
  }
  label {
    cursor: pointer;
  }
  input[disabled] + label {
    /* color: text.disabled; */
    color: disabled;
    cursor: unset;
  }

  ${color}
  ${space}
`;

const CheckBox = ({
  id,
  label,
  labelPlacement,
  labelColor = "secondary",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & CheckBoxProps & SpaceProps) => {
  const [checkboxId, setCheckboxId] = useState(id);

  // extract spacing props
  let spacingProps: any = {};
  for (const key in props) {
    if (key.startsWith("m") || key.startsWith("p")) (spacingProps as any)[key] = (props as any)[key];
  }

  useEffect(() => setCheckboxId(Math.random()), []);

  return (
    <Wrapper
      color={`${labelColor}.main`}
      labelPlacement={labelPlacement}
      {...spacingProps}>
      <StyledCheckBox id={checkboxId} type="checkbox" {...props} />
      <label htmlFor={checkboxId}>{label}</label>
    </Wrapper>
  );
};

export default CheckBox;
