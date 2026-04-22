import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  LayoutDashboard, DollarSign, Map, Users, 
  TrendingUp, Calendar, ArrowUpRight 
} from 'lucide-react';
import './App.css';

// Mock Data cho biểu đồ doanh thu (Revenue)
const revenueData = [
  { name: 'T1', value: 4000 }, { name: 'T2', value: 3000 },
  { name: 'T3', value: 2000 }, { name: 'T4', value: 2780 },
  { name: 'T5', value: 1890 }, { name: 'T6', value: 2390 },
  { name: 'T7', value: 3490 },
];

// Mock Data cho Top Tours
const topToursData = [
  { name: 'Đà Nẵng', bookings: 120, color: '#3b82f6' },
  { name: 'Phú Quốc', bookings: 98, color: '#10b981' },
  { name: 'Hạ Long', bookings: 86, color: '#8b5cf6' },
  { name: 'Đà Lạt', bookings: 72, color: '#f59e0b' },
];

function App() {
  const [activeTab, setActiveTab] = useState('Overview');

  // Component cho từng mục ở Sidebar
  const SidebarItem = ({ icon: Icon, label }) => (
    <div 
      onClick={() => setActiveTab(label)}
      className={`flex items-center gap-3 p-3 mb-2 cursor-pointer rounded-xl transition-all duration-200 ${
        activeTab === label 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'hover:bg-gray-100 text-gray-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-semibold">{label}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar - Cố định bên trái */}
      <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <TrendingUp className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-black text-gray-800 tracking-tight">TOUR CLOUD</h1>
        </div>
        
        <nav className="flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase mb-4 px-2">Menu chính</p>
          <SidebarItem icon={LayoutDashboard} label="Overview" />
          <SidebarItem icon={DollarSign} label="Revenue" />
          <SidebarItem icon={Map} label="Top Tours" />
          <SidebarItem icon={Users} label="Customers" />
        </nav>

        <div className="bg-blue-50 p-4 rounded-2xl">
          <p className="text-sm font-bold text-blue-800">Cần giúp đỡ?</p>
          <p className="text-xs text-blue-600 mt-1">Liên hệ đội kỹ thuật Cloud Proj</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{activeTab}</h2>
            <p className="text-gray-500 mt-1">Chào mừng quay trở lại, Khánh!</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg font-medium shadow-sm">
              <Calendar size={18} />
              <span>23 Tháng 4, 2026</span>
            </button>
          </div>
        </header>

        {/* Nội dung thay đổi theo Tab */}
        {activeTab === 'Overview' && (
          <div className="space-y-10">
            {/* 4 Cards Thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Tổng đơn đặt" value="1,240" percent="+12%" icon={LayoutDashboard} color="blue" />
              <StatCard title="Doanh thu" value="6.450M" percent="+8.2%" icon={DollarSign} color="green" />
              <StatCard title="Tour hoạt động" value="12" percent="0%" icon={Map} color="purple" />
              <StatCard title="Người dùng" value="850" percent="+5.4%" icon={Users} color="orange" />
            </div>

            {/* Grid biểu đồ nhỏ bên dưới */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-6">Xu hướng doanh thu</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                      <YAxis hide />
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-6">Top Tour yêu thích</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topToursData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="bookings" radius={[0, 10, 10, 0]} barSize={30}>
                        {topToursData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'Overview' && (
          <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium italic">Trang {activeTab} đang được thiết kế...</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Component phụ cho thẻ thống kê
const StatCard = ({ title, value, percent, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <span className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
          <ArrowUpRight size={12} />
          {percent}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-gray-800 mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default App;