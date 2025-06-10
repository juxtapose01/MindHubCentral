import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./AssessmentResults.css";

// Chart colors
const COLORS = ["#36CFC9", "#FFC107", "#FF4C61"];

// Custom label renderer
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#444"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontSize: "0.85rem", fontWeight: 500 }}
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const AssessmentResults = () => {
  const [results, setResults] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8001/get-results/")
      .then((response) => response.json())
      .then((data) => {
        const grouped = { Low: 0, Medium: 0, High: 0 };
        data.forEach((r) => {
          const percentage = (r.score / 9) * 100;
          if (percentage <= 30) grouped.Low++;
          else if (percentage <= 60) grouped.Medium++;
          else grouped.High++;
        });

        const chartFormatted = [
          { name: "Low Stress", value: grouped.Low },
          { name: "Medium Stress", value: grouped.Medium },
          { name: "High Stress", value: grouped.High },
        ];
        setChartData(chartFormatted);
        setResults(data);
      })
      .catch((err) => console.error("Error fetching results:", err));
  }, []);

  return (
    <div className="results-page">
      <h2>📊 Stress Assessment Overview</h2>
      <p className="subtitle">
        Distribution of user stress levels based on past assessments.
      </p>

      {chartData.length === 0 ? (
        <p className="empty-text">No results found.</p>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                labelLine={true}
                label={renderCustomLabel}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AssessmentResults;
