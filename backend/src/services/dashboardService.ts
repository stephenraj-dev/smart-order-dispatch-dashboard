// services/dashboardService.ts

import { orders } from "../data/order";
import { riders } from "../data/rider";

export const getDashboardSummary =
  () => {

    const totalOrders = orders.length;

    const activeRiders =
      riders.filter(
        r => r.status === "busy"
      ).length;

    const delivered =
      orders.filter(
        o => o.status === "delivered"
      ).length;

    const successRate =
      totalOrders > 0
        ? Number(
            (
              (delivered / totalOrders) *
              100
            ).toFixed(1)
          )
        : 0;

    const deliveredOrders =
      orders.filter(
        o => o.deliveredAt
      );

    let totalMinutes = 0;

    deliveredOrders.forEach(order => {

      totalMinutes += Math.floor(
        (
          new Date(
            order.deliveredAt!
          ).getTime()
          -
          new Date(
            order.createdAt
          ).getTime()
        ) / 60000
      );
    });

    return {
      totalOrders,
      activeRiders,
      successRate,
      avgDeliveryTime:
        deliveredOrders.length > 0
          ? Math.round(
              totalMinutes /
              deliveredOrders.length
            )
          : 0
    };
  };