import { getTheme } from "@utils/utils";
import styled from "styled-components";
import { layoutConstant } from "utils/constants";

const StyledNavbar = styled.div`
  position: sticky;
  top: ${layoutConstant.headerHeight};
  z-index: 998;
  height: 60px;
  background: ${getTheme("colors.secondary.main")};
  box-shadow: ${getTheme("shadows.regular")};

  .nav-link {
    font-size: 14px;
    cursor: pointer;
    color: white;
    white-space: nowrap;
    transition: all 0.2s ease-in-out;
    &:hover {
      color: ${getTheme("colors.primary.main")};
    }
  }

  /* Specific color for links inside dropdown cards */
  .root-child .nav-link,
  .child .nav-link {
    color: ${getTheme("colors.gray.700")};
    &:hover {
      color: ${getTheme("colors.primary.main")};
    }
  }

  .root-child {
    display: none;
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 99;
    padding-top: 5px; /* Bridge the gap */
  }
  
  .root:hover > .root-child {
    display: block;
  }

  .child {
    display: none;
    position: absolute;
    top: 0;
    left: 100%;
    z-index: 99;
    padding-left: 5px; /* Bridge the gap */
  }
  
  .parent:hover > .child {
    display: block;
  }

  .nav-list-wrapper {
    display: flex;
    /* overflow-x: auto removed as it clips absolute dropdowns */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  @media only screen and (max-width: 900px) {
    display: none;
  }
`;

export default StyledNavbar;
