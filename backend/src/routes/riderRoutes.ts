import express from "express";
import { riders } from "../data/rider";
import { orders } from "../data/order";
import { getIO } from "../socket/socket";
import { getDashboardSummary } from "../services/dashboardService";

const router = express.Router();

router.get("/", (req, res) => {
    res.json(riders);
});

router.post("/:id/status", (req, res) => {

  const riderId = Number(req.params.id);

  const { status } = req.body;

  const rider = riders.find(
    r => r.id === riderId
  );

  if (!rider) {
    return res.status(404).json({
      message: "Rider not found"
    });
  }

  rider.status = status;

  getIO().emit(
    "dashboard_update",
    getDashboardSummary()
  );

  res.json({
    message: "Rider status updated",
    rider
  });

  if (status === "offline") {

    const activeOrders = orders.filter(
        order =>
        order.riderId === rider.id &&
        order.status !== "delivered" &&
        order.status !== "failed"
    );

    activeOrders.forEach(order => {

        const newRider = riders.find(
        r =>
            r.id !== rider.id &&
            r.status === "available"
        );

        if (newRider) {

        order.riderId = newRider.id;

        newRider.activeOrders++;
        newRider.status = "busy";

        getIO().emit("rider_offline", {
            orderId: order.id,
            previousRider: rider.name,
            newRider: newRider.name
        });
        }
    });
    }
});

export default router;