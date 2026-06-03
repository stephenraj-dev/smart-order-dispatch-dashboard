import express from "express";
import { Order } from "../types/order";
import { assignRider } from "../services/dispatchServices";
import { getIO } from "../socket/socket";
import { orders } from "../data/order";
import { riders } from "../data/rider";
import { verifyAdmin } from "../middleware/auth";
import { getDashboardSummary } from "../services/dashboardService";

const router = express.Router();

router.post("/", (req, res) => {
  const {
    customerName,
    pickupZone,
    dropZone,
    priority
  } = req.body;

  const rider = assignRider(
    pickupZone,
    priority
  );

  if (!rider) {
    return res.status(503).json({
      message: "No riders available",
      retryAfter: 5
    });
  }

  const order: Order = {
    id: Date.now(),
    customerName,
    pickupZone,
    dropZone,
    priority,
    status: "assigned",
    riderId: rider.id,
    createdAt: new Date(),

    timeline: [
      {
        status: "created",
        riderName: rider.name,
        timestamp: new Date()
      },
      {
        status: "assigned",
        riderName: rider.name,
        timestamp: new Date()
      }
    ]
  };

  orders.push(order);

  getIO().emit(
    "dashboard_update",
    getDashboardSummary()
  );

  getIO().emit(
    "order_created",
    order
  );

  res.status(201).json({
    message: "Order created",
    riderAssigned: rider.name,
    order
  });
});

router.get(
    "/analytics",
    verifyAdmin,
    (req, res) => {

        const totalOrders = orders.length;

        const delivered = orders.filter(
        order => order.status === "delivered"
        ).length;

        const failed = orders.filter(
        order => order.status === "failed"
        ).length;

        const pending = orders.filter(
        order =>
            order.status !== "delivered" &&
            order.status !== "failed"
        ).length;

        let totalMinutes = 0;

        const deliveredOrders =
        orders.filter(
            order =>
            order.deliveredAt
        );

        deliveredOrders.forEach(
        order => {

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
        }
        );

        const avgDeliveryTime =
        deliveredOrders.length
            ? totalMinutes /
            deliveredOrders.length
            : 0;

        const riderPerformance =
        riders.map(rider => {

            const riderOrders =
            orders.filter(
                order =>
                order.riderId === rider.id
            );

            const deliveredByRider =
              riderOrders.filter(
                order =>
                  order.status === "delivered" &&
                  order.deliveredAt
              );

            let riderMinutes = 0;

            deliveredByRider.forEach(order => {

              riderMinutes += Math.floor(
                (
                  new Date(order.deliveredAt!).getTime()
                  -
                  new Date(order.createdAt).getTime()
                ) / 60000
              );

            });

            const riderAvgTime =
              deliveredByRider.length > 0
                ? Math.round(
                    riderMinutes /
                    deliveredByRider.length
                  )
                : 0;

            return {
              riderName: rider.name,

              totalDelivered:
                deliveredByRider.length,

              totalFailed:
                riderOrders.filter(
                  o => o.status === "failed"
                ).length,

              avgTime: riderAvgTime
            };
        });

        const zones = [
        "Anna Nagar",
        "T Nagar",
        "KK Nagar"
        ];

        const zoneWiseSummary =
        zones.map(zone => {

            const zoneOrders =
            orders.filter(
                order =>
                order.pickupZone ===
                zone
            );

            const success =
            zoneOrders.filter(
                order =>
                order.status ===
                "delivered"
            ).length;

            return {
            zone,

            totalOrders:
                zoneOrders.length,

            successRate:
                zoneOrders.length
                ? (
                    success /
                    zoneOrders.length
                    ) * 100
                : 0
            };
        });

        res.json({
        totalOrders,
        delivered,
        failed,
        pending,
        avgDeliveryTime,
        riderPerformance,
        zoneWiseSummary
        });
    }
);

router.get("/", (req, res) => {
    res.json(orders);
});

router.get(
    "/dashboard-summary",
    (req, res) => {

      const totalOrders = orders.length;

      const activeRiders = riders.filter(
        rider => rider.status === "busy"
      ).length;

      const delivered = orders.filter(
        order => order.status === "delivered"
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
          order => order.deliveredAt
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

      const avgDeliveryTime =
        deliveredOrders.length > 0
          ? Math.round(
              totalMinutes /
              deliveredOrders.length
            )
          : 0;

      res.json({
        totalOrders,
        activeRiders,
        successRate,
        avgDeliveryTime
      });
    }
);

router.patch("/:id/status", (req, res) => {

  const orderId = Number(req.params.id);

  const { status } = req.body;

  const order = orders.find(
    o => o.id === orderId
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  const rider = riders.find(
    r => r.id === order.riderId
  );

  if (!rider) {
    return res.status(404).json({
      message: "Rider not found"
    });
  }

  order.status = status;

  order.timeline.push({
    status,
    riderName: rider.name,
    timestamp: new Date()
  });


  if (status === "delivered") {

    rider.activeOrders--;

    if (rider.activeOrders <= 0) {
        rider.activeOrders = 0;
        rider.status = "available";
    }

    order.deliveredAt = new Date();

    getIO().emit("order_delivered", {
    orderId: order.id,
    riderName: rider.name,
    timeTaken:
        Math.floor(
        (Date.now() -
            new Date(order.createdAt).getTime())
        / 60000
        )
    });
  }

  if (status === "failed") {

    rider.activeOrders--;

    if (rider.activeOrders <= 0) {
        rider.activeOrders = 0;
        rider.status = "available";
    }

    const previousRiderId = rider.id;

    const availableRiders = riders.filter(
    r =>
        r.id !== previousRiderId &&
        r.status !== "offline"
    );

    const retryRider = availableRiders.sort(
    (a, b) => a.activeOrders - b.activeOrders
    )[0];

    if (retryRider) {
        retryRider.activeOrders++;
        retryRider.status = "busy";

        order.riderId = retryRider.id;
        }

    order.timeline.push({
      status: "reassigned",
      riderName: retryRider.name,
      timestamp: new Date()
    });

    getIO().emit("order_failed", {
    orderId: order.id,
    reason: "Delivery Failed",
    retryRider: retryRider?.name
    });

    return res.json({
        message: "Order failed and reassigned",
        previousRider: rider.name,
        retryRider: retryRider?.name,
        order
    });
  }

  if (status === "picked_up") {

    getIO().emit("order_picked", {
        orderId: order.id,
        riderName: rider.name,
        timestamp: new Date()
    });

    return res.json({
        message: "Order picked up",
        order
    });
  }

  res.json({
    message: "Status updated",
    order
  });
});

export default router;