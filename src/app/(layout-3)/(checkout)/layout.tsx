import { Fragment, PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Fragment>
      {children}
    </Fragment>
  );
}
