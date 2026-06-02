import { useSelector } from "react-redux";

export default function RiderPanel() {
  const riders = useSelector((state: any) => state.riders);

  return (
    <div>
      <h3>Riders</h3>

      {riders.map((r: any) => (
        <div key={r.id}>
          <span
            style={{
              color:
                r.status === "available"
                  ? "green"
                  : r.status === "busy"
                  ? "orange"
                  : "grey"
            }}
          >
            ●
          </span>

          {r.name} ({r.activeOrders})
        </div>
      ))}
    </div>
  );
}