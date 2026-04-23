import React, { useState } from 'react';
import StatsCard from './components/StatsCard';
import RevenueLineChart from './components/RevenueLineChart';
import TopToursBarChart from './components/TopToursBarChart';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  LayoutDashboard, DollarSign, Map, Users, 
  TrendingUp, Calendar, ArrowUpRight 
} from 'lucide-react';
import './App.css';

// --- MOCK DATA THỰC TẾ ---
const revenueData = [
  { name: '2024-01-01', value: 15000000 },
  { name: '2024-01-02', value: 22000000 },
  { name: '2024-01-03', value: 18000000 },
  { name: '2024-01-04', value: 25000000 },
  { name: '2024-01-05', value: 21000000 },
  { name: '2024-01-06', value: 29000000 },
  { name: '2024-01-07', value: 34000000 },
];

const topToursData = [
  { name: 'Đà Nẵng', bookings: 120, color: '#3b82f6' },
  { name: 'Phú Quốc', bookings: 98, color: '#10b981' },
  { name: 'Hạ Long', bookings: 86, color: '#8b5cf6' },
  { name: 'Đà Lạt', bookings: 72, color: '#f59e0b' },
];

// --- COMPONENT CON (Giữ nguyên logic của bạn) ---
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

// --- COMPONENT CHÍNH ---
function App() {
  const [activeTab, setActiveTab] = useState('Overview');

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
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col fixed h-full">
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

        <div className="bg-blue-50 p-4 rounded-2xl mt-auto">
          <p className="text-sm font-bold text-blue-800">Cần giúp đỡ?</p>
          <p className="text-xs text-blue-600 mt-1">Liên hệ đội kỹ thuật Cloud Proj</p>
        </div>
      </aside>

      {/* Main Content Area - Added ml-72 to account for fixed sidebar */}
      <main className="flex-1 ml-72 p-10 overflow-y-auto">
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

        {/* TAB: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* 4 Cards Thống kê - Sử dụng StatsCard component */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard title="Tổng đơn đặt" value="1,240" percent="+12%" icon={LayoutDashboard} color="blue" />
              <StatsCard title="Doanh thu" value="150.5M" percent="+8.2%" icon={DollarSign} color="green" />
              <StatsCard title="Tour hoạt động" value="12" percent="0%" icon={Map} color="purple" />
              <StatsCard title="Người dùng" value="850" percent="+5.4%" icon={Users} color="orange" />
            </div>

            {/* Grid biểu đồ - Sử dụng các component chuyên biệt */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RevenueLineChart data={revenueData} />
              <TopToursBarChart data={topToursData} />
            </div>
          </div>
        )}

        {/* CHỨC NĂNG MỚI: TAB REVENUE CHI TIẾT */}
        {activeTab === 'Revenue' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <RevenueLineChart data={revenueData} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsCard title="Lợi nhuận dự tính" value="45.2M" percent="+2%" icon={TrendingUp} color="green" />
              <StatsCard title="Trung bình đơn" value="1.2M" percent="-0.5%" icon={DollarSign} color="blue" />
            </div>
          </div>
        )}

        {/* CHỨC NĂNG MỚI: TAB TOP TOURS CHI TIẾT */}
        {activeTab === 'Top Tours' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <TopToursBarChart data={topToursData} />
            </div>
          </div>
        )}

        {/* Tab thiết kế sau (Dành cho Customers) */}
        {activeTab === 'Customers' && (
          <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium italic">Trang {activeTab} đang được thiết kế...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;