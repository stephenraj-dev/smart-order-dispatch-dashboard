import SummaryCards from "../components/SummaryCards";
import CreateOrderForm from "../components/CreateOrderForm";
import OrderTable from "../components/OrdersTable";
import RiderPanel from "../components/RiderPannel";
import AnalyticsPanel from "../components/AnalyticsPannel";
import deliveryBike from "../assets/delivery-bike.avif";

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-slate-100 overflow-hidden">

      <img
        src={deliveryBike}
        alt=""
        className="
          absolute
          inset-0
          m-auto
          w-200
          h-200
          object-contain
          opacity-100
          pointer-events-none
          select-none
        "
      />
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              🚚
            </div>

            <div>
              <h1 className="font-bold text-slate-800">
                Smart Dispatch
              </h1>
              <p className="text-xs text-slate-500">
                Live Operations Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              ● LIVE
            </span>

            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              SR
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-7xl p-6">
        {/* Hero Header */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold">
            Smart Order Dispatch Dashboard
          </h1>

          <p className="mt-3 text-blue-100">
            Monitor orders, riders and dispatch performance in real-time.
          </p>

          <div className="mt-6 flex gap-4">
            <div className="rounded-xl bg-white/20 px-4 py-2 backdrop-blur-md">
              <span className="text-sm">⚡ Real-Time Updates</span>
            </div>

            <div className="rounded-xl bg-white/20 px-4 py-2 backdrop-blur-md">
              <span className="text-sm">🚚 Smart Assignment</span>
            </div>

            <div className="rounded-xl bg-white/20 px-4 py-2 backdrop-blur-md">
              <span className="text-sm">📊 Live Analytics</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 rounded-3xl border border-white/20 bg-white p-6 shadow-lg">
          <SummaryCards />
        </div>

        {/* Create Order */}
        <div className="mb-8 rounded-3xl border border-white bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              Create New Order
            </h2>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              Quick Action
            </span>
          </div>

          <CreateOrderForm />
        </div>

        {/* Main Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-4">
          {/* Orders */}
          <div className="xl:col-span-3">
            <div className="h-full rounded-3xl border border-white bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                  Orders Management
                </h2>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                  Live Feed
                </span>
              </div>

              <OrderTable />
            </div>
          </div>

          {/* Riders */}
          <div>
            <div className="h-full rounded-3xl border border-white bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                  Riders
                </h2>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  Active
                </span>
              </div>

              <RiderPanel />
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="rounded-3xl border border-white bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              Analytics & Insights
            </h2>

            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
              Performance
            </span>
          </div>

          <AnalyticsPanel />
        </div>
      </div>
    </div>
  );
}