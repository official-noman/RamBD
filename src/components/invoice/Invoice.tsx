"use client";

import { Fragment } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import Box from "@component/Box";
import Image from "@component/Image";
import FlexBox from "@component/FlexBox";
import Typography, { H3, H5, H6, Paragraph, Tiny } from "@component/Typography";
import { currency } from "@utils/utils";
import Order from "@models/order.model";

// STYLED COMPONENTS
const StyledInvoice = styled(Box)`
  background: #fff;
  padding: 15px 25px;
  max-width: 900px;
  margin: auto;
  font-family: 'Inter', sans-serif;
  color: #333;
  line-height: 1.1;

  @media print {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
    box-shadow: none !important;
    
    .hide-from-print {
      display: none !important;
    }

    @page {
      margin: 8mm !important;
      size: A4;
    }
    
    body {
      -webkit-print-color-adjust: exact;
    }
  }

  .header {
    border-bottom: 2px solid #F2F4F8;
    padding-bottom: 8px;
    margin-bottom: 8px;
    break-inside: avoid;
  }

  .company-info {
    text-align: left;
  }

  .invoice-title {
    color: #1c4b78;
    margin-bottom: 1px;
    font-size: 20px;
    font-weight: 700;
  }

  .meta-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 10px;
    break-inside: avoid;
  }

  .meta-column {
    flex: 1;
    line-height: 1.2;
  }

  .invoice-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
    break-inside: auto;
  }

  .invoice-table thead {
    display: table-header-group;
  }

  .invoice-table tr {
    break-inside: avoid;
    break-after: auto;
  }

  .invoice-table th,
  .invoice-table td {
    border: 1px solid #ddd;
    padding: 3px 5px;
    text-align: left;
    font-size: 9px;
  }

  .invoice-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #444;
  }

  .product-name {
    color: #1c4b78;
    font-weight: 700;
    font-size: 9.5px;
  }

  .product-sn {
    color: #1c4b78;
    font-weight: 700;
    display: block;
    margin-top: 0px;
    font-size: 8.5px;
  }

  .blue-val {
    color: #1c4b78;
    font-weight: 700;
  }

  .total-val {
    color: #27ae60;
    font-weight: 700;
  }

  .summary-section {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    break-inside: avoid;
  }

  .summary-table {
    width: 230px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 1px 0;
    font-size: 10px;
  }

  .summary-row.total {
    border-top: 1px solid #ccc;
    padding-top: 3px;
    margin-top: 3px;
    font-weight: 700;
    font-size: 11px;
  }

  .signature-section {
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
    margin-bottom: 15px;
    break-inside: avoid;
  }

  .signature-line {
    width: 180px;
    border-top: 1.5px solid #333;
    text-align: center;
    padding-top: 4px;
    font-size: 9px;
    color: #333;
    font-weight: 500;
  }

  .terms-section {
    margin-top: 8px;
    font-size: 8.5px;
    color: #444;
    line-height: 1.3;
    break-inside: avoid;
  }

  .terms-title {
    font-weight: 700;
    text-decoration: underline;
    margin-bottom: 2px;
    color: #333;
    font-size: 9px;
  }

  .logo-img {
    width: 45px;
    height: 45px;
    object-fit: contain;
    margin-right: 15px;
  }
`;

type InvoiceProps = {
  order: Order;
};

const Invoice = ({ order }: InvoiceProps) => {
  if (!order) return null;

  return (
    <StyledInvoice id="printable-invoice">
      {/* Header */}
      <Box className="header">
        <FlexBox justifyContent="space-between" alignItems="flex-start">
          <FlexBox alignItems="center">
            <Image
              src="/assets/images/rambd_logo.webp"
              className="logo-img"
              alt="Logo"
            />
            <Box className="company-info">
              <H3 className="invoice-title" color="inherit">RamBD</H3>
              <Typography fontSize="10px" display="block" color="#666">Address: House 33, Road 04, Dhanmondi, Dhaka-1205</Typography>
              <Typography fontSize="10px" display="block" color="#666">Contact: +880-1650-666999</Typography>
              <Typography fontSize="10px" display="block" color="#666">Email: info@rambd.com &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Website: https://rambd.com</Typography>
            </Box>
          </FlexBox>
          <Box textAlign="right">
            <Typography fontSize="11px" fontWeight="600" color="#333">{format(new Date(), "yyyyMMdd")}</Typography>
          </Box>
        </FlexBox>
      </Box>

      {/* Meta Info */}
      <Box className="meta-section">
        <Box className="meta-column">
          <Paragraph mb="2px"><strong>Order ID:</strong> {order.id.toString().startsWith("RB") ? order.id : `RB${order.id.toString().toUpperCase()}`}</Paragraph>
          <Paragraph mb="2px"><strong>Customer:</strong> {order.user?.name?.firstName || "Customer"}</Paragraph>
          <Paragraph mb="2px"><strong>Contact:</strong> {order.user?.phone || "N/A"}</Paragraph>
          <Paragraph mb="2px"><strong>Address:</strong> {order.shippingAddress || "N/A"}</Paragraph>
          {(order.district || order.thana) && (
            <Paragraph mb="2px"><strong>District/Thana:</strong> {[order.district, order.thana].filter(Boolean).join(", ")}</Paragraph>
          )}
        </Box>
        <Box className="meta-column" textAlign="right">
          <Paragraph mb="2px"><strong>Invoice No::</strong> {order.id.toString().startsWith("RB") ? order.id : `RB${order.id.toString().toUpperCase()}`}</Paragraph>
          <Paragraph mb="2px"><strong>Order Date:</strong> {format(new Date(order.createdAt), "yyyy-MM-dd hh:mm:ss a")}</Paragraph>
          <Paragraph mb="2px"><strong>Delivery Date:</strong> N/A</Paragraph>
          <Paragraph mb="2px"><strong>Sales Person:</strong> RamBD</Paragraph>
          <Paragraph mb="2px"><strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? 'Cash On Delivery' : order.paymentMethod || 'Cash On Delivery'}</Paragraph>
        </Box>
      </Box>

      {/* Table */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th style={{ width: "50px" }}>#SL</th>
            <th>Product Details</th>
            <th style={{ width: "80px", textAlign: "center" }}>Quantity</th>
            <th style={{ width: "100px", textAlign: "center" }}>Unit Price</th>
            <th style={{ width: "100px", textAlign: "right" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <span className="product-name">{item.product_name}</span>
              </td>
              <td className="blue-val" style={{ textAlign: "center" }}>{item.product_quantity}</td>
              <td className="blue-val" style={{ textAlign: "center" }}>{item.product_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td className="total-val" style={{ textAlign: "right" }}>
                ৳{(item.product_price * item.product_quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <Box className="summary-section">
        <Box className="summary-table">
          <Box className="summary-row">
            <Typography>Total Amount : </Typography>
            <Typography fontWeight="700" color="#e74c3c">৳{order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
          </Box>
          <Box className="summary-row">
            <Typography>Promotion discount : </Typography>
            <Typography>৳0.00</Typography>
          </Box>
          <Box className="summary-row">
            <Typography>VAT : </Typography>
            <Typography>N/A</Typography>
          </Box>
          <Box className="summary-row">
            <Typography>Shipping Cost : </Typography>
            <Typography color="#e74c3c">৳{(order.shippingCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
          </Box>
          <Box className="summary-row total">
            <Typography>Total Payable Amount:</Typography>
            <Typography>৳{(order.totalPrice + (order.shippingCost || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Signatures */}
      <Box className="signature-section">
        <Box className="signature-line">Customer Signature</Box>
        <Box className="signature-line">Admin Signature</Box>
      </Box>

      {/* Terms */}
      <Box className="terms-section">
        <Typography className="terms-title">Terms & Condition</Typography>
        <Typography mb="4px">
          In case of product mismatch, damage, expiry, or billing errors, the customer must immediately return the product to the Delivery Manager or inform us by calling <strong>01958 666 999</strong> between <strong>9:00 AM and 6:00 PM</strong>.
        </Typography>
        <Typography mb="4px">
          For eligible cases, refunds or returns will be processed within <strong>7-10 business working days</strong> from the date of claim submission.
        </Typography>
        <Typography mb="4px">
          If no refund or cancellation policy is applicable to a specific product, that will be clearly stated on the product page or in our policies.
        </Typography>
        <Typography>
          For any queries, complaints, or feedback, please contact us at <strong>+880-1958-666999</strong> between <strong>9:00 AM and 6:00 PM</strong>.
        </Typography>
      </Box>
    </StyledInvoice>
  );
};

export default Invoice;
