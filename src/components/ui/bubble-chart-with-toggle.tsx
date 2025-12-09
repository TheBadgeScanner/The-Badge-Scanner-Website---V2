// File: components/ui/bubble-chart-with-toggle.tsx
import { useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Switch } from "./switch";
import { Label } from "./label";
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

export function BubbleChartWithToggle({ data, onCompanyClick }) {
  const [isNormalized, setIsNormalized] = useState(false);

  // Normalize data if toggle is on
  const processedData = data.map(company => {
    let processedCompany = { ...company };
    
    if (isNormalized) {
      // Normalize bubble size to a reasonable range (20-200)
      const maxZ = Math.max(...data.map(c => c.z));
      const minZ = Math.min(...data.map(c => c.z));
      const normalizedZ = ((company.z - minZ) / (maxZ - minZ)) * 180 + 20;
      processedCompany.z = normalizedZ;
    }

    return {
      ...processedCompany,
      fill: getTemperatureColor(company.conversionScore)
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="normalize-bubbles"
          checked={isNormalized}
          onCheckedChange={setIsNormalized}
        />
        <Label htmlFor="normalize-bubbles" className="text-sm">
          Normalize bubble sizes
        </Label>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={processedData}>
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
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
