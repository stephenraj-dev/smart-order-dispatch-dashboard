import { useState } from "react";
import { useAppDispatch } from "../hooks/reduxHooks";
import { createOrder } from "../features/orders/orderSlice";
import toast from "react-hot-toast";

export default function CreateOrderForm() {
  const [customerName, setCustomerName] = useState("");
  const [pickupZone, setPickupZone] = useState("Anna Nagar");
  const [dropZone, setDropZone] = useState("T Nagar");
  const [priority, setPriority] = useState("normal");

  const dispatch = useAppDispatch();
  const handleCreateOrder  = async (e: React.FormEvent) => {

    e.preventDefault();

    try {
      const result = await dispatch(
        createOrder({
          customerName,
          pickupZone,
          dropZone,
          priority,
        })
      ).unwrap();

      toast.success(
        `Order Created! Rider ID: ${result.order.riderId}`
      );

      setCustomerName("");
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to create order"
      );
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-6">

        <p className="mt-1 text-sm text-slate-500">
          Assign delivery requests to available riders
        </p>
      </div>

      <form
        className="space-y-5"
      >
        {/* Customer Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Customer Name
          </label>

          <input
            type="text"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Pickup & Drop */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Pickup Location
            </label>

            <select
              value={pickupZone}
              onChange={(e) =>
                setPickupZone(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option>Anna Nagar</option>
              <option>T Nagar</option>
              <option>KK Nagar</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Drop Location
            </label>

            <select
              value={dropZone}
              onChange={(e) =>
                setDropZone(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option>Anna Nagar</option>
              <option>T Nagar</option>
              <option>KK Nagar</option>
            </select>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Priority
          </label>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="normal">
              Normal Delivery
            </option>

            <option value="urgent">
              Urgent Delivery
            </option>
          </select>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-blue-700">
            Order Preview
          </h3>

          <div className="space-y-1 text-sm text-slate-700">
            <p>
              <strong>Customer:</strong>{" "}
              {customerName || "Not entered"}
            </p>

            <p>
              <strong>Route:</strong>{" "}
              {pickupZone} → {dropZone}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              <span
                className={
                  priority === "urgent"
                    ? "font-semibold text-red-600"
                    : "font-semibold text-green-600"
                }
              >
                {priority}
              </span>
            </p>
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleCreateOrder}
          className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
        >
          Create Order
        </button>
      </form>
    </div>
  );
}