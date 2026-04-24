import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TopToursBarChart = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <XAxis type="number" hide />
        <YAxis 
          dataKey="tour_name" 
          type="category" 
          width={100} 
          tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} 
          axisLine={false} 
          tickLine={false} 
        />
        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
        <Bar dataKey="total_bookings" radius={[0, 10, 10, 0]} barSize={20}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={index < 3 ? '#2563eb' : '#e2e8f0'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopToursBarChart;