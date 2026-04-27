export interface ContextProps {
  state: InitialState;
  dispatch: (args: ActionType) => void;
}

export interface InitialState {
  cart: CartItem[];
  isCartOpen: boolean;
  isHeaderFixed: boolean;
  user: any | null;
}

export interface CartItem {
  qty: number;
  name: string;
  slug?: string;
  price: number;
  imgUrl?: string;
  id: string | number;
  discount?: number;
  regularPrice?: number;
  originalPrice?: number;
}

interface CartActionType {
  type: "CHANGE_CART_AMOUNT";
  payload: CartItem;
}

interface LayoutActionType {
  type: "TOGGLE_HEADER";
  payload: boolean;
}

interface ToggleCartActionType {
  type: "TOGGLE_CART";
  payload?: boolean;
}

interface RestoreCartActionType {
  type: "RESTORE_CART";
  payload: CartItem[];
}

interface ClearCartActionType {
  type: "CLEAR_CART";
}

interface SetUserActionType {
  type: "SET_USER";
  payload: any;
}

interface LogoutActionType {
  type: "LOGOUT";
}

export type ActionType =
  | CartActionType
  | LayoutActionType
  | RestoreCartActionType
  | ClearCartActionType
  | ToggleCartActionType
  | SetUserActionType
  | LogoutActionType;
