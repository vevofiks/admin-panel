export type StoreProvider = "shopify" | "medusa" | "custom";

export interface Store {
  id: string;
  name: string;
  provider: StoreProvider;
  domain: string;
  currency: string;
  logoUrl?: string;
}

export interface UnifiedProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  options: Record<string, string>;
}

export interface UnifiedProduct {
  id: string;
  title: string;
  description: string;
  vendor: string;
  category: string;
  status: "active" | "draft" | "archived";
  imageUrl?: string;
  variants: UnifiedProductVariant[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  storeId: string;
}

export interface UnifiedOrderLineItem {
  productId: string;
  productTitle: string;
  variantTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface UnifiedOrder {
  id: string;
  orderNumber: string;
  status: "pending" | "processing" | "fulfilled" | "cancelled" | "refunded";
  fulfillmentStatus: "unfulfilled" | "partial" | "fulfilled";
  paymentStatus: "pending" | "paid" | "refunded" | "partially_refunded";
  customer: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  lineItems: UnifiedOrderLineItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: {
    city: string;
    country: string;
    zip: string;
  };
  createdAt: string;
  updatedAt: string;
  storeId: string;
}

export interface UnifiedCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  segment: "vip" | "loyal" | "at_risk" | "new" | "lost";
  totalOrders: number;
  ltv: number; // lifetime value
  avgOrderValue: number;
  lastOrderAt: string;
  joinedAt: string;
  city: string;
  country: string;
  tags: string[];
  storeId: string;
}

export interface AnalyticsDataPoint {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface KPIData {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  avgOrderValue: number;
  aovChange: number;
}
