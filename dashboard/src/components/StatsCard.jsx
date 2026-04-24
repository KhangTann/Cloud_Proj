import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const StatsCard = ({ title, value, percent, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colors[color] || colors.blue}`}>
          {Icon && <Icon size={24} />}
        </div>
        <div className="flex items-center gap-1 text-green-500 font-bold text-[10px] bg-green-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={12} /> {percent}
        </div>
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-gray-900 mt-1">{value !== undefined ? value : 0}</h3>
    </div>
  );
};

export default StatsCard;