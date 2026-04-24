import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RevenueBarChart = ({ data = [] }) => {
  // Hàm để định dạng hiển thị tiền tệ trên trục Y (VD: 1000000 -> 1M)
  const formatYAxis = (tickItem) => {
    if (tickItem === 0) return '0';
    return `${(tickItem / 1000000).toFixed(1)}M`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="date" // Backend cần trả về trường 'date' hoặc 'month'
          axisLine={false} 
          tickLine={false} 
          tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
          dy={10}
        />
        <YAxis 
          tickFormatter={formatYAxis}
          axisLine={false} 
          tickLine={false} 
          tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
        />
        <Tooltip 
          cursor={{fill: '#f8fafc'}}
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
          formatter={(value) => [new Intl.NumberFormat('vi-VN').format(value) + ' ₫', 'Doanh thu']}
        />
        <Bar 
          dataKey="total_revenue" 
          radius={[6, 6, 0, 0]} 
          barSize={35}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              // Cột cuối cùng sẽ có màu xanh đậm nổi bật, các cột cũ màu xám nhạt
              fill={index === data.length - 1 ? '#2563eb' : '#e2e8f0'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueBarChart;