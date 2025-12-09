// File: components/ui/company-bubble-chart.tsx
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { getTemperatureColor } from "../constants/advancedOrgData";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">Total Leads: {data.x}</p>
        <p className="text-sm text-muted-foreground">Avg Sales Intel: {data.y}</p>
        <p className="text-sm text-muted-foreground">Conversion Score: {data.conversionScore}</p>
      </div>
    );
  }
  return null;
};

export function CompanyBubbleChart({ data, onCompanyClick }) {
  const dataWithColors = data.map(company => ({
    ...company,
    fill: getTemperatureColor(company.conversionScore)
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart data={dataWithColors}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="x" 
          name="Total Leads"
          label={{ value: 'Total Leads', position: 'bottom' }}
        />
        <YAxis 
          dataKey="y" 
          name="Avg Sales Intel"
          label={{ value: 'Avg Sales Intel Score', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Scatter 
          dataKey="z" 
          className="cursor-pointer"
          onClick={onCompanyClick}
        >
          {dataWithColors.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
