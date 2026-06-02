import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

export default function SummaryCards() {
  const analytics = useSelector((state: RootState) => state.analytics);

  const cards = [
    { label: "Total Orders", value: analytics.totalOrders },
    { label: "Active Riders", value: analytics.pending + analytics.delivered },
    { label: "Success Rate", value: analytics.totalOrders ? `${((analytics.delivered / analytics.totalOrders) * 100).toFixed(1)}%` : "0%" },
    { label: "Avg Delivery Time", value: `${analytics.avgDeliveryTime} min` },
  ];

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {cards.map((c, i) => (
        <div key={i}
          style={{
            flex: 1,
            padding: 16,
            borderRadius: 12,
            background: "#111827",
            color: "white",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
          }}>
          <h4 style={{ margin: 0, opacity: 0.7 }}>{c.label}</h4>
          <h2>{c.value}</h2>
        </div>
      ))}
    </div>
  );
}