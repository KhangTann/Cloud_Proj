import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TopToursBarChart = () => {
  // Dữ liệu Top 10 Tours
  const top10Tours = [
    { tour_name: "Hạ Long Bay Luxury", total_bookings: 150 },
    { tour_name: "Phú Quốc Sun Island", total_bookings: 128 },
    { tour_name: "Đà Nẵng City Tour", total_bookings: 115 },
    { tour_name: "Sapa Trekking", total_bookings: 98 },
    { tour_name: "Huế Imperial City", total_bookings: 85 },
    { tour_name: "Nha Trang Diving", total_bookings: 76 },
    { tour_name: "Phong Nha Cave", total_bookings: 64 },
    { tour_name: "Hội An Memories", total_bookings: 58 },
    { tour_name: "Mekong Delta", total_bookings: 42 },
    { tour_name: "Củ Chi Tunnels", total_bookings: 35 },
  ];

  const colors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[400px]">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Top 10 Tours tiêu biểu</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={top10Tours} layout="vertical" margin={{ left: 40 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="tour_name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#475569', fontSize: 11, fontWeight: 500}}
            width={120}
          />
          <Tooltip 
            cursor={{fill: '#f8fafc'}}
            contentStyle={{ borderRadius: '12px', border: 'none' }}
          />
          <Bar dataKey="total_bookings" radius={[0, 8, 8, 0]} barSize={20}>
            {top10Tours.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index < 3 ? '#2563eb' : '#cbd5e1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopToursBarChart;