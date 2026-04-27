import axios from "@lib/axios";
import Order from "@models/order.model";

const getOrders = async (): Promise<Order[]> => {
  const response = await axios.get("/api/users/orders");
  return response.data;
};

const getIds = async (): Promise<{ id: string }[]> => {
  const response = await axios.get("/api/users/order-ids");
  return response.data;
};

const getOrder = async (id: string): Promise<Order> => {
  try {
    const response = await axios.get("/api/users/order", { params: { id } });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return null as any;
  }
};

export default { getOrders, getOrder, getIds };
