"use client";

import { useMemo, useReducer, useContext, createContext, PropsWithChildren, useEffect } from "react";

// TYPES
import { ActionType, InitialState, ContextProps } from "./types";
// DATA
import { INITIAL_CART } from "./data";

const INITIAL_STATE = {
  cart: INITIAL_CART,
  isCartOpen: false,
  isHeaderFixed: false,
  user: null
};

export const AppContext = createContext<ContextProps>({
  state: INITIAL_STATE,
  dispatch: () => { }
});

const reducer = (state: InitialState, action: ActionType) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { ...state, user: null };

    case "TOGGLE_HEADER":
      return { ...state, isHeaderFixed: action.payload };

    case "TOGGLE_CART":
      return { ...state, isCartOpen: action.payload !== undefined ? action.payload : !state.isCartOpen };

    case "CHANGE_CART_AMOUNT":
      let cartList = state.cart;
      let cartItem = action.payload;
      let exist = cartList.find((item) => item.id === cartItem.id);

      if (cartItem.qty < 1) {
        const filteredCart = cartList.filter((item) => item.id !== cartItem.id);
        return { ...state, cart: filteredCart };
      }

      // IF PRODUCT ALREADY EXITS IN CART
      if (exist) {
        const newCart = cartList.map((item) =>
          item.id === cartItem.id ? { ...item, ...cartItem } : item
        );

        return { ...state, cart: newCart };
      }

      return { ...state, cart: [...cartList, cartItem] };

    case "RESTORE_CART":
      return { ...state, cart: action.payload };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    default: {
      return state;
    }
  }
};

export function AppProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch({ type: "RESTORE_CART", payload: JSON.parse(savedCart) });
    }

    const savedUser = localStorage.getItem("rambd_user");
    if (savedUser) {
      dispatch({ type: "SET_USER", payload: JSON.parse(savedUser) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext<ContextProps>(AppContext);
