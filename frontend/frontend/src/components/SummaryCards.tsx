import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchDashboardSummary, updateDashboard } from "../features/dashboard/dashboardSummarySlice";
import { socket } from "../socket/socket";

export default function SummaryCards() {
  const dispatch = useAppDispatch();

  const dashboard =
    useAppSelector(
      state => state.dashboard
    );

  useEffect(() => {

    dispatch(
      fetchDashboardSummary()
    );

    socket.on(
      "dashboard_update",
      data => {

        dispatch(
          updateDashboard(data)
        );
      }
    );

    return () => {
      socket.off(
        "dashboard_update"
      );
    };

  }, [dispatch]);

  const cards = [
    {
      title: "Total Orders",
      value:
        dashboard.totalOrders,
      icon: "📦",
      bg: "bg-blue-50",
    },
    {
      title: "Active Riders",
      value:
        dashboard.activeRiders,
      icon: "🛵",
      bg: "bg-green-50",
    },
    {
      title: "Success Rate",
      value: `${dashboard.successRate}%`,
      icon: "✅",
      bg: "bg-emerald-50",
    },
    {
      title: "Avg Delivery",
      value: `${dashboard.avgDeliveryTime} min`,
      icon: "⏱️",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      {cards.map(card => (
        <div
          key={card.title}
          className={`${card.bg} rounded-3xl p-6 shadow-md border border-slate-100 transition hover:shadow-xl`}
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                {card.title}
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-800">
                {card.value}
              </h3>
            </div>

            <div className="text-4xl">
              {card.icon}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}