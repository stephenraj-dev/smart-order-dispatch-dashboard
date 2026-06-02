import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function AnalyticsPanel() {
  const analytics = useSelector((state: RootState) => state.analytics);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Zone Wise Orders</h3>

      <BarChart width={500} height={250} data={analytics.zoneWiseSummary}>
        <XAxis dataKey="zone" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalOrders" />
      </BarChart>

      <h3>Rider Performance</h3>

      <table style={{ width: "100%", color: "white" }}>
        <thead>
          <tr>
            <th>Rider</th>
            <th>Delivered</th>
            <th>Failed</th>
            <th>Avg Time</th>
          </tr>
        </thead>

        <tbody>
          {analytics.riderPerformance.map((r, i) => (
            <tr key={i}>
              <td>{r.riderName}</td>
              <td>{r.totalDelivered}</td>
              <td>{r.totalFailed}</td>
              <td>{r.avgTime} min</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}