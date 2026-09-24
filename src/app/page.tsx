import { OrderTrackingScreen } from "@/components/order/OrderTrackingScreen"

export const metadata = {
  title: "Order Tracking #ORD-849204 | ApexStore Delivery",
  description: "Real-time delivery tracking, visual timeline, courier communication, and package status.",
}

export default function Home() {
  return <OrderTrackingScreen />
}
