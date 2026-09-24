export type OrderStatus =
  | "processing"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "delayed"
  | "pending_tracking"
  | "missing"

export type ScenarioType =
  | "out_for_delivery"
  | "delayed"
  | "delivered_not_received"
  | "pending_tracking"
  | "standard_delivered"
  | "standard_in_transit"
  | "loading"
  | "error"

export interface TrackingStep {
  id: string
  title: string
  subtitle: string
  timestamp: string
  location?: string
  status: "completed" | "current" | "upcoming" | "delayed" | "alert"
  details?: string[]
}

export interface OrderItem {
  id: string
  name: string
  variant: string
  price: number
  quantity: number
  imageUrl: string
}

export interface CourierInfo {
  carrierName: string
  trackingNumber: string
  trackingUrl?: string
  driverName?: string
  driverPhoto?: string
  driverRating?: number
  driverVehicle?: string
  driverPhone?: string
  stopsAway?: number
  supportPhone: string
}

export interface DeliveryProof {
  photoUrl: string
  deliveredAt: string
  locationDescription: string
  signedBy?: string
  coordinates?: { lat: number; lng: number }
}

export interface Order {
  id: string
  orderNumber: string
  placedDate: string
  estimatedDelivery: string
  estimatedDeliveryWindow: string
  status: OrderStatus
  statusHeadline: string
  statusMessage: string
  isDelayed?: boolean
  delayReason?: string
  newEstimatedDelivery?: string
  compensation?: {
    code: string
    amount: string
    description: string
  }
  deliveryProof?: DeliveryProof
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    deliveryNotes?: string
  }
  items: OrderItem[]
  pricing: {
    subtotal: number
    shipping: number
    discount: number
    tax: number
    total: number
  }
  paymentMethod: {
    type: string
    last4: string
    brandIcon?: string
  }
  courier: CourierInfo
  timeline: TrackingStep[]
}
