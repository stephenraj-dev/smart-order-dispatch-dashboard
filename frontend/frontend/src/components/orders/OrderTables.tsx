import { useSelector } from "react-redux";
import { useState } from "react";

export default function OrderTable() {
  const orders = useSelector((state: any) => state.orders);
  const [expanded, setExpanded] = useState<number | null>(null);

  const sorted = [...orders].sort((a, b) => {
    if (a.priority === "urgent") return -1;
    if (b.priority === "urgent") return 1;
    return 0;
  });

  return (
    <table width="100%">
      <tbody>
        {sorted.map((o: any) => (
          <>
            <tr
              onClick={() =>
                setExpanded(expanded === o.id ? null : o.id)
              }
              style={{
                background: o.priority === "urgent" ? "#ffe5e5" : "",
                textDecoration: o.status === "failed" ? "line-through" : ""
              }}
            >
              <td>{o.id}</td>
              <td>{o.customerName}</td>
              <td>{o.pickupZone}</td>
              <td>{o.priority}</td>
              <td>{o.status}</td>
              <td>{o.riderName}</td>
            </tr>

            {expanded === o.id && (
              <tr>
                <td colSpan={6}>
                  {o.timeline?.map((t: any, i: number) => (
                    <div key={i}>
                      {t.status} → {t.timestamp}
                    </div>
                  ))}
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  );
}