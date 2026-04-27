"use client";

import { PropsWithChildren } from "react";

import AppLayout from "../layout-1";
import Container from "@component/Container";
import Navbar from "@component/navbar/Navbar";

export default function ShopLayout({ children, categories }: PropsWithChildren & { categories?: any }) {
  return (
    <AppLayout navbar={<Navbar categories={categories} />}>
      <Container mt="5px" mb="2rem">{children}</Container>
    </AppLayout>
  );
}
