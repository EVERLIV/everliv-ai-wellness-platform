
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface ProtocolChartProps {
  data: any[];
  xAxisKey: string;
}

export const ProtocolChart = ({ data, xAxisKey }: ProtocolChartProps) => {
  // Если данных нет, показываем заглушку
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-gray-500">Недостаточно данных для графика</p>
      </div>
    );
  }

  // Определяем ключи для значений (кроме xAxisKey)
  const dataKeys = Object.keys(data[0]).filter(key => key !== xAxisKey);

  // Настраиваем цвета для линий
  const colors = ["#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ef4444"];
  
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-lg rounded p-3 border border-gray-100">
          <p className="font-medium text-sm">{label}</p>
          <div className="mt-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <p className="text-sm text-gray-600">
                  {entry.name}: <span className="font-medium">{entry.value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        
        {dataKeys.map((dataKey, index) => (
          <Line
            key={dataKey}
            type="monotone"
            dataKey={dataKey}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name={dataKey}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
