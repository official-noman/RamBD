import { PropsWithChildren } from "react";
import AppLayout from "@component/layout/layout-3";
import navbarApi from "@utils/__api__/navbar";

export default async function Layout({ children }: PropsWithChildren) {
  const categories = await navbarApi.getNavbarServices();
  return <AppLayout categories={categories}>{children}</AppLayout>;
}
