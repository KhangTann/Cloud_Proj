import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Map, Users, ClipboardList, Loader2 } from 'lucide-react';
import axios from 'axios';

import StatsCard from './components/StatsCard';
import RevenueLineChart from './components/RevenueLineChart';
import TopToursBarChart from './components/TopToursBarChart';
import BookingTable from './components/BookingTable';

function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_revenue: 0, total_bookings: 0, total_users: 0, total_tours: 0 });
  const [revenueData, setRevenueData] = useState([]);
  const [topToursData, setTopToursData] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);

  const API_BASE_URL = 'http://127.0.0.1:8000/api/analytics';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rev, top, sum, list] = await Promise.all([
          axios.get(`${API_BASE_URL}/revenue/`).catch(() => ({ data: { data: [] } })),
          axios.get(`${API_BASE_URL}/top-tours/`).catch(() => ({ data: { data: [] } })),
          axios.get(`${API_BASE_URL}/summary/`).catch(() => ({ data: { data: {} } })),
          axios.get(`${API_BASE_URL}/latest-bookings/`).catch(() => ({ data: { data: [] } }))
        ]);

        setRevenueData(rev.data?.data || []);
        setTopToursData(top.data?.data || []);
        
        if (sum.data?.data) {
          setStats({
            total_revenue: sum.data.data.total_revenue,
            total_bookings: sum.data.data.total_bookings,
            total_users: sum.data.data.total_users,
            total_tours: sum.data.data.active_tours 
          });
        }

        setBookingsList(list.data?.data || []);
      } catch (err) {
        console.error("Lỗi fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hàm format rút gọn (dùng cho Overview)
  const formatRevenueShort = (val) => {
    const num = Number(val);
    if (isNaN(num) || num === 0) return "0M";
    return (num / 1000000).toFixed(1) + "M";
  };

  // Hàm format đầy đủ (dùng cho tiêu đề Revenue)
  const formatRevenueFull = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
      <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase italic">TourGo Loading...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="w-72 bg-white border-r border-gray-100 p-8 fixed h-full flex flex-col shadow-sm">
        <div className="flex items-center gap-3 mb-10 text-blue-600">
          <TrendingUp size={32} strokeWidth={3} />
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-gray-900">TOURGO</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {['Overview', 'Revenue', 'Top Tours', 'Customers'].map((item) => (
            <div key={item} onClick={() => setActiveTab(item)}
              className={`p-4 rounded-2xl cursor-pointer font-bold text-sm transition-all duration-300 ${
                activeTab === item ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-blue-50'
              }`}>{item}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="h-1 w-10 bg-blue-600 mb-2"></div>
            <h2 className="text-6xl font-black uppercase italic tracking-tighter text-gray-900 leading-none">{activeTab}</h2>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 font-bold text-gray-400 text-sm">24.04.2026</div>
        </header>

        <div className="animate-in fade-in duration-700">
          {activeTab === 'Overview' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Tổng Bookings" value={stats.total_bookings} percent="+12%" icon={ClipboardList} color="blue" />
                <StatsCard title="Doanh thu" value={formatRevenueShort(stats.total_revenue)} percent="+Live" icon={DollarSign} color="green" />
                <StatsCard title="Tổng Tour" value={stats.total_tours} percent="+Active" icon={Map} color="purple" />
                <StatsCard title="Người dùng" value={stats.total_users} percent="+5%" icon={Users} color="orange" />
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[45px] border border-gray-50 shadow-sm h-[480px]">
                  <p className="text-[10px] font-black uppercase text-gray-300 mb-8 tracking-[0.2em]">Tổng doanh thu</p>
                  <RevenueLineChart data={revenueData} />
                </div>
                <div className="bg-white p-10 rounded-[45px] border border-gray-50 shadow-sm h-[480px]">
                  <p className="text-[10px] font-black uppercase text-gray-300 mb-8 tracking-[0.2em]">Top 5 Tour được đặt nhiều nhất</p>
                  <TopToursBarChart data={topToursData.slice(0, 5)} />
                </div>
              </div>
              <div className="bg-white p-10 rounded-[45px] border border-gray-50 shadow-sm">
                <p className="text-[10px] font-black uppercase text-gray-300 mb-8 tracking-[0.2em]">Giao dịch gần đây</p>
                <BookingTable data={bookingsList} />
              </div>
            </div>
          )}

          {activeTab === 'Revenue' && (
            <div className="space-y-10">
              {/* BẢNG TIÊU ĐỀ DOANH THU TỔNG (Dạng con số hoàn chỉnh) */}
              <div className="bg-white p-10 rounded-[45px] border border-gray-50 shadow-sm flex justify-between items-center bg-gradient-to-r from-white to-blue-50">
                <div>
                  <h3 className="text-xl font-black uppercase italic text-gray-900 tracking-tighter mb-2">Tổng doanh thu hệ thống</h3>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]"></p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-blue-600 tracking-tighter">
                    {formatRevenueFull(stats.total_revenue)}
                  </p>
                  <span className="text-[10px] font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest mt-2 inline-block">
                  </span>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[45px] border border-gray-50 shadow-sm h-[500px]">
                <p className="text-[10px] font-black uppercase text-gray-300 mb-8 tracking-[0.2em]">Biểu đồ phân tích doanh thu</p>
                <RevenueLineChart data={revenueData} />
              </div>
            </div>
          )}

          {activeTab === 'Top Tours' && (
            <div className="bg-white p-10 rounded-[45px] border border-gray-50 shadow-sm h-[600px]">
              <p className="text-[10px] font-black uppercase text-gray-300 mb-8 tracking-[0.2em]">Xếp hạng Tour</p>
              <TopToursBarChart data={topToursData} />
            </div>
          )}

          {activeTab === 'Customers' && (
            <div className="bg-white p-10 rounded-[45px] border border-gray-50 shadow-sm">
              <p className="text-[10px] font-black uppercase text-gray-300 mb-8 tracking-[0.2em]">Danh sách giao dịch khách hàng</p>
              <BookingTable data={bookingsList} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;