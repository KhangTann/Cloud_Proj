import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts';

// Format tiền Việt Nam
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

const RevenueLineChart = () => {
  // Mock data theo format Gold Table
  const goldData = [
    { date: "2024-01-01", total_revenue: 45000000, num_bookings: 3 },
    { date: "2024-01-02", total_revenue: 78000000, num_bookings: 5 },
    { date: "2024-01-03", total_revenue: 32000000, num_bookings: 2 },
    { date: "2024-01-04", total_revenue: 110000000, num_bookings: 8 },
    { date: "2024-01-05", total_revenue: 85000000, num_bookings: 6 },
    { date: "2024-01-06", total_revenue: 125000000, num_bookings: 9 },
    { date: "2024-01-07", total_revenue: 95000000, num_bookings: 7 },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[400px]">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Xu hướng doanh thu & Đơn đặt</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={goldData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#94a3b8', fontSize: 12}}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#94a3b8', fontSize: 11}}
            tickFormatter={(value) => `${value / 1000000}M`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value, name) => {
              if (name === "total_revenue") return [formatter.format(value), "Doanh thu"];
              return [value + " đơn", "Số lượng đặt"];
            }}
          />
          <Line 
            type="monotone" 
            dataKey="total_revenue" 
            stroke="#2563eb" 
            strokeWidth={4} 
            dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8 }}
          />
          {/* Line ẩn để hiển thị num_bookings trong Tooltip */}
          <Line type="monotone" dataKey="num_bookings" stroke="transparent" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueLineChart;