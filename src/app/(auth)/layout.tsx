import { PropsWithChildren } from "react";
import AppLayout from "@component/layout/layout-3/Layout-3";
import navbarApi from "@utils/__api__/navbar";
import Container from "@component/Container";

export default async function Layout({ children }: PropsWithChildren) {
  const categories = await navbarApi.getNavbarServices();
  return (
    <AppLayout categories={categories}>
      <Container mt="5px" mb="2rem">
        {children}
      </Container>
    </AppLayout>
  );
}
