import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import axios from "../../api/axios";
import { updateRider } from "../../features/riders/riderSlice";

export default function RiderPanel() {
  const riders = useSelector((state: RootState) => state.riders.list);
  const dispatch = useDispatch();

  const toggleStatus = async (rider: any) => {
    const newStatus = rider.status === "offline" ? "available" : "offline";

    const res = await axios.post(`/riders/${rider.id}/status`, {
      status: newStatus,
    });

    dispatch(updateRider(res.data.rider));
  };

  return (
    <div style={{ width: 280, background: "#0f172a", padding: 12, borderRadius: 12 }}>
      <h3 style={{ color: "white" }}>Riders</h3>

      {riders.map((r) => (
        <div key={r.id}
          style={{
            padding: 10,
            marginBottom: 8,
            borderRadius: 8,
            background: "#1e293b",
            color: "white"
          }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{r.name}</strong>
            <button onClick={() => toggleStatus(r)}>
              {r.status === "offline" ? "Go Online" : "Go Offline"}
            </button>
          </div>

          <small>{r.zone}</small>
          <div>Active Orders: {r.activeOrders}</div>
        </div>
      ))}
    </div>
  );
}