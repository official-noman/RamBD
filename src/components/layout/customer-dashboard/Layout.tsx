import { PropsWithChildren } from "react";

import Grid from "@component/grid/Grid";

export default function CustomerDashboardLayout({ children }: PropsWithChildren) {
  return (
    <Grid container spacing={6}>
      <Grid item lg={12} xs={12}>
        {children}
      </Grid>
    </Grid>
  );
}
