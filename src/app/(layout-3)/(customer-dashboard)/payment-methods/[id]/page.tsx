import { Fragment } from "react";
// GLOBAL CUSTOM COMPONENTS
import { Card1 } from "@component/Card1";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
// PAGE SECTION COMPONENTS
import { BackToMethods, MethodEditForm } from "@sections/customer-dashboard/payment-method";
// CUSTOM DATA MODEL
import { IDParams } from "interfaces";

export default async function PaymentMethodEditor({ params }: IDParams) {
  const { id } = await params;

  return (
    <Fragment>
      <DashboardPageHeader
        button={<BackToMethods />}
        iconName="credit-card_filled"
        title={`${id === "add" ? "Add New" : "Edit"} Payment Method`}
      />

      <Card1 borderRadius={8}>
        <MethodEditForm />
      </Card1>
    </Fragment>
  );
}
