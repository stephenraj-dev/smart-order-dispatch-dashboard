import { useState } from "react";
import { useEffect } from "react";
import { fetchRiders, updateRiderStatus } from "../features/riders/riderSlice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { socket } from "../socket/socket";

export default function RiderPanel() {

  const dispatch = useAppDispatch();

  const { riders, loading } = useAppSelector( (state) => state.riders );
  
  const [selectedRider, setSelectedRider] = useState<any>(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    dispatch(fetchRiders());

    const refreshRiders = () => { dispatch(fetchRiders()); };

    socket.on( "rider_offline", refreshRiders );

    socket.on( "order_created", refreshRiders);

    socket.on( "order_delivered", refreshRiders );

    socket.on( "order_failed", refreshRiders);

    socket.on( "order_picked", refreshRiders);

    return () => {

      socket.off( "rider_offline", refreshRiders);

      socket.off( "order_created", refreshRiders );

      socket.off( "order_delivered", refreshRiders );

      socket.off( "order_failed", refreshRiders );

      socket.off( "order_picked", refreshRiders );
    };

  }, [dispatch]);

  const handleToggle = (
    rider: any
  ) => {
    if (
      rider.status !== "offline" &&
      rider.activeOrders > 0
    ) {
      setSelectedRider(rider);
      setShowModal(true);
      return;
    }

    dispatch(
      updateRiderStatus({
        riderId: rider.id,
        status:
          rider.status === "offline"
            ? "available"
            : "offline",
      })
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";

      case "busy":
        return "bg-yellow-500";

      case "offline":
        return "bg-gray-400";

      default:
        return "bg-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading riders...
      </div>
    );
  }

  return (
    <>
      <div className="rounded-3xl bg-white shadow-lg">
        {/* Header */}
        <div className="border-b px-5 py-4">

          <p className="text-sm text-slate-500">
            Live Rider Availability
          </p>
        </div>

        {/* Rider List */}
        <div className="space-y-4 p-4">
          {riders.map((rider) => (
            <div
              key={rider.id}
              className="rounded-2xl border border-slate-200 p-4 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full ${getStatusColor(
                        rider.status
                      )}`}
                    />

                    <h3 className="font-semibold text-slate-800">
                      {rider.name}
                    </h3>
                  </div>

                  <p className="mt-1 text-sm capitalize text-slate-500">
                    {rider.status}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 px-3 py-1">
                  <span className="text-sm font-semibold">
                    {rider.activeOrders}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() =>
                    handleToggle(rider)
                  }
                  className={`w-full rounded-xl py-2 font-medium transition
                  ${
                    rider.status === "offline"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {rider.status === "offline"
                    ? "Go Online"
                    : "Go Offline"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              ⚠️
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Confirm Offline
            </h3>

            <p className="mt-3 text-slate-600">
              Rider has{" "}
              <strong>
                {selectedRider.activeOrders}
              </strong>{" "}
              active orders.
            </p>

            <p className="mt-2 text-slate-600">
              Going offline will
              auto-reassign these orders.
            </p>

            <p className="mt-2 text-slate-600">
              Are you sure you want to continue?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="flex-1 rounded-xl border border-slate-300 py-3 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await dispatch(
                    updateRiderStatus({
                      riderId: selectedRider.id,
                      status: "offline",
                    })
                  );

                  setShowModal(false);

                  dispatch(fetchRiders());
                }}
                className="flex-1 rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}