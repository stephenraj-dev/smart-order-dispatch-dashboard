// src/types/analytics.ts

export interface RiderPerformance {
  riderName: string;
  totalDelivered: number;
  totalFailed: number;
  avgTime: number;
}

export interface ZoneSummary {
  zone: string;
  totalOrders: number;
  successRate: number;
}

export interface AnalyticsResponse {
  totalOrders: number;
  delivered: number;
  failed: number;
  pending: number;
  avgDeliveryTime: number;
  riderPerformance: RiderPerformance[];
  zoneWiseSummary: ZoneSummary[];
}