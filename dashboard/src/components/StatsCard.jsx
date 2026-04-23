import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const StatsCard = ({ title, value, percent, icon: Icon, color }) => {
  // Bảng màu cho Icon box
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  /**
   * Logic xử lý màu sắc và icon cho phần trăm (Tăng/Giảm)
   * Giúp Dashboard trông chuyên nghiệp và trực quan hơn
   */
  const getPercentStatus = (p) => {
    if (!p) return null;
    const isNegative = p.startsWith('-');
    const isNeutral = p === "0%" || p === "Sẵn sàng" || p === "Thực tế";

    if (isNeutral) {
      return {
        class: 'text-blue-500 bg-blue-50',
        icon: <Minus size={12} />
      };
    }
    if (isNegative) {
      return {
        class: 'text-red-500 bg-red-50',
        icon: <ArrowDownRight size={12} />
      };
    }
    return {
      class: 'text-green-500 bg-green-50',
      icon: <ArrowUpRight size={12} />
    };
  };

  const status = getPercentStatus(percent);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        {/* Box chứa Icon */}
        <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 duration-300 ${colors[color] || colors.blue}`}>
          <Icon size={24} />
        </div>
        
        {/* Box chứa % Tăng trưởng */}
        {percent && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${status.class}`}>
            {status.icon}
            {percent}
          </span>
        )}
      </div>
      
      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-black text-gray-800 mt-1 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
};

export default StatsCard;