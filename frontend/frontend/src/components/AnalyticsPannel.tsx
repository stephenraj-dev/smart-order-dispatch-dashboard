import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchAnalytics } from "../features/analytics/analyticsSlice";
import { socket } from "../socket/socket";

const COLORS = [
  "#22c55e",
  "#ef4444",
];

export default function AnalyticsPanel() {

  const dispatch = useAppDispatch();

  const { data, loading } = useAppSelector( state => state.analytics );

  useEffect(() => {
    dispatch(fetchAnalytics());

    const refreshAnalytics = () => {
      dispatch(fetchAnalytics());
    };

    socket.on("order_created", refreshAnalytics);

    socket.on("order_picked", refreshAnalytics);

    socket.on("order_delivered", refreshAnalytics);

    socket.on("order_failed", refreshAnalytics);

    socket.on("rider_offline", refreshAnalytics);

    return () => {
      socket.off("order_created", refreshAnalytics);

      socket.off("order_picked", refreshAnalytics);

      socket.off("order_delivered", refreshAnalytics);

      socket.off("order_failed", refreshAnalytics);

      socket.off("rider_offline", refreshAnalytics);
    };
  }, [dispatch]);

  const zoneData =
    data?.zoneWiseSummary?.map(
      (zone: any) => ({
        zone: zone.zone,
        orders: zone.totalOrders,
      })
    ) || [];

  // Rider Performance
  const riderPerformance = data?.riderPerformance || [];
  console.log("analytics:", riderPerformance);

  const pieData = [
    {
      name: "Delivered",
      value: data?.delivered || 0,
    },
    {
      name: "Failed",
      value: data?.failed || 0,
    },
  ];

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Analytics Dashboard
        </h2>

        <p className="text-sm text-slate-500">
          Delivery performance and zone activity
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Zone Chart */}
        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            Zone Wise Order Volume
          </h3>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={zoneData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="zone" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="orders"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4">
          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-sm text-slate-500">
              Total Deliveries
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {data?.delivered || 0}
            </h3>
          </div>

          <div className="rounded-2xl bg-green-50 p-5">
            <p className="text-sm text-slate-500">
              Success Rate
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {data?.totalOrders
                ? (
                    (data.delivered /
                      data.totalOrders) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </h3>
          </div>

          <div className="rounded-2xl bg-amber-50 p-5">
            <p className="text-sm text-slate-500">
              Average Delivery Time
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {Math.round(
                data?.avgDeliveryTime || 0
              )} mins
            </h3>
          </div>
        </div>
      </div>

      {/* Rider Performance Table */}
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Rider Performance
          </h3>

          <p className="text-sm text-slate-500">
            Delivery success metrics by rider
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Rider
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Zone
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Delivered
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Failed
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Avg Time
                </th>
              </tr>
            </thead>

            <tbody>
              {riderPerformance.map(
                (rider: any, index: any) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {rider.riderName}
                    </td>

                    <td className="px-6 py-4">
                      {index === 0 || index === 3
                        ? "Anna Nagar"
                        : index === 1 ||
                          index === 4
                        ? "T Nagar"
                        : "KK Nagar"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-green-100 px-3 py-1 text-green-700">
                        {rider.totalDelivered}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-red-100 px-3 py-1 text-red-700">
                        {rider.totalFailed}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {Math.round(rider.avgTime)} min
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-bold mb-4">
          Rider Performance Charts
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}