import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/reduxHooks";
import { useAppSelector } from "../hooks/reduxHooks";
import { fetchOrders } from "../features/orders/orderSlice";
import { socket } from "../socket/socket";
import { updateOrderStatus } from "../api/orderServicesApi";

export default function OrdersTable() {

  const dispatch = useAppDispatch();

  const { orders, loading } = useAppSelector( (state) => state.orders );

  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {

    dispatch(fetchOrders());

    const refreshOrders = () => {
      dispatch(fetchOrders());
    };

    socket.on( "order_created", refreshOrders );

    socket.on( "order_delivered", refreshOrders );

    socket.on( "order_failed", refreshOrders );

    socket.on( "order_picked", refreshOrders );

    return () => {

      socket.off( "order_created", refreshOrders );

      socket.off("order_delivered", refreshOrders );

      socket.off( "order_failed", refreshOrders );

      socket.off( "order_picked", refreshOrders );
    };

  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="text-slate-500 font-medium">
          Loading orders...
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow">
        <h3 className="text-slate-500">No orders found</h3>
      </div>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const priorityWeight: any = {
      urgent: 1,
      normal: 2,
      low: 3,
    };

    return priorityWeight[a.priority] - priorityWeight[b.priority];
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700 border border-red-200";
      case "normal":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "low":
        return "bg-green-100 text-green-700 border border-green-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-green-100 text-green-700 border border-green-200";
      case "failed":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-orange-100 text-orange-700 border border-orange-200";
    }
  };

  const handleStatusUpdate = async (
    orderId: number,
    status: "picked_up" | "delivered" | "failed"
  ) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const time = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${day}-${month}-${year} ${time}`;
  };

  return (
    <div className="rounded-3xl bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="border-b bg-slate-50 px-6 py-4">

        <p className="mt-1 text-sm text-slate-500">
          Click an order to view its timeline
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Pickup
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Drop
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Actions
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Priority
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedOrders.map((order) => (
              <>
                <tr
                  key={order.id}
                  onClick={() =>
                    setExpandedId(
                      expandedId === order.id ? null : order.id
                    )
                  }
                  className={`
                    cursor-pointer border-b transition-all duration-200
                    hover:bg-slate-50
                    ${
                      order.priority === "urgent"
                        ? "bg-red-50"
                        : ""
                    }
                    ${
                      order.status === "failed"
                        ? "line-through text-slate-400 opacity-70"
                        : ""
                    }
                  `}
                >
                  <td
                    className={`px-6 py-4 font-medium ${
                      order.status === "failed"
                        ? "line-through"
                        : ""
                    }`}
                  >
                    #{order.id}
                  </td>

                  <td
                    className={`px-6 py-4 font-medium ${
                      order.status === "failed"
                        ? "line-through"
                        : ""
                    }`}
                  >
                    {order.customerName}
                  </td>

                  <td
                    className={`px-6 py-4 font-medium ${
                      order.status === "failed"
                        ? "line-through"
                        : ""
                    }`}
                  >
                    {order.pickupZone}
                  </td>

                  <td
                    className={`px-6 py-4 font-medium ${
                      order.status === "failed"
                        ? "line-through"
                        : ""
                    }`}
                  >
                    {order.dropZone}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>
                    {order.status === "assigned" && (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() =>
                          handleStatusUpdate(order.id, "picked_up")
                        }
                      >
                        Pick Up
                      </button>
                    )}

                    {order.status === "picked_up" && (
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() =>
                            handleStatusUpdate(order.id, "delivered")
                          }
                        >
                          Deliver
                        </button>

                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() =>
                            handleStatusUpdate(order.id, "failed")
                          }
                        >
                          Fail
                        </button>
                      </div>
                    )}

                    {(order.status === "delivered" ||
                      order.status === "failed") && (
                      <span className="text-gray-500">
                        Completed
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPriorityBadge(
                        order.priority
                      )}`}
                    >
                      {order.priority}
                    </span>
                  </td>
                </tr>

                {expandedId === order.id && (
                  <tr>
                    <td colSpan={6}>
                      <div className="bg-slate-50 px-8 py-4">
                        <h4 className="mb-3 font-semibold text-slate-700">
                          Timeline
                        </h4>

                        <div className="space-y-3">
                          {order.timeline?.map(
                            (t: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-3"
                              >
                                <div className="h-3 w-3 rounded-full bg-blue-500" />

                                <div className="flex flex-col">
                                  <span className="font-medium text-slate-700">
                                    {t.status}
                                  </span>

                                  <span className="text-sm text-slate-500">
                                    {formatDateTime(t.timestamp)}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {sortedOrders.map((order) => (
          <div
            key={order.id}
            onClick={() =>
              setExpandedId(
                expandedId === order.id ? null : order.id
              )
            }
            className={`
              rounded-2xl border bg-white p-4 shadow-sm
              ${
                order.status === "failed"
                  ? "line-through text-slate-400 opacity-70"
                  : ""
              }
            `}
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">
                #{order.id}
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadge(
                  order.priority
                )}`}
              >
                {order.priority}
              </span>
            </div>

            <p className="mt-2 font-medium">
              {order.customerName}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {order.pickupZone} → {order.dropZone}
            </p>

            <div className="mt-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            {expandedId === order.id && (
              <div className="mt-4 border-t pt-4">
                <h4 className="mb-2 font-semibold">
                  Timeline
                </h4>

                <div className="space-y-2">
                  {order.timeline?.map(
                    (t: any, index: number) => (
                      <div key={index}>
                        <p className="font-medium">
                          {t.status}
                        </p>

                        <p className="text-sm text-slate-500">
                          {t.timestamp}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}