import type MockAdapter from "axios-mock-adapter";

import { market2ApiEndpoints } from "./__db__/market-2";
import { shopApiEndpoints } from "./__db__/shop";
import { salesApiEndpoints } from "./__db__/sales";
import { adminApiEndpoints } from "./__db__/users";
import { orderApiEndpoints } from "./__db__/orders";
import { ticketApiEndpoints } from "./__db__/ticket";
import { AddressApiEndPoints } from "./__db__/address";
import { productApiEndpoints } from "./__db__/products";
import { dashboardApiEndpoints } from "./__db__/dashboard";
import { relatedProductsApiEndpoints } from "./__db__/related-products";

export const MockEndPoints = (Mock: MockAdapter) => {
  market2ApiEndpoints(Mock);
  shopApiEndpoints(Mock);
  salesApiEndpoints(Mock);
  adminApiEndpoints(Mock);
  orderApiEndpoints(Mock);
  ticketApiEndpoints(Mock);
  AddressApiEndPoints(Mock);
  productApiEndpoints(Mock);
  dashboardApiEndpoints(Mock);
  relatedProductsApiEndpoints(Mock);

  Mock.onAny().passThrough();
};
