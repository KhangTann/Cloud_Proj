import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Calendar, LayoutDashboard, 
  DollarSign, Map, Users, ClipboardList,
  Loader2, AlertCircle, Search
} from 'lucide-react';
import Papa from 'papaparse'; 

// Components dự án
import BookingTable from './components/BookingTable';
import StatsCard from './components/StatsCard';
import RevenueLineChart from './components/RevenueLineChart';
import TopToursBarChart from './components/TopToursBarChart';
import './App.css';

// --- MOCK DATA (Dự phòng cho Biểu đồ) ---
const revenueData = [
  { date: '2026-04-18', total_revenue: 15000000, num_bookings: 3 },
  { date: '2026-04-19', total_revenue: 22000000, num_bookings: 5 },
  { date: '2026-04-20', total_revenue: 18000000, num_bookings: 4 },
  { date: '2026-04-21', total_revenue: 25000000, num_bookings: 6 },
  { date: '2026-04-22', total_revenue: 34000000, num_bookings: 8 },
];

const topToursData = [
  { name: 'Phú Quốc Sun Island', bookings: 98 },
  { name: 'Hạ Long Luxury', bookings: 85 },
  { name: 'Sapa Trekking', bookings: 65 },
  { name: 'Nha Trang Diving', bookings: 48 },
  { name: 'Hội An Memories', bookings: 42 },
];

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

const formatCompactNumber = (number) => {
  if (number < 1000) return number;
  return new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  }).format(number);
};

// --- SUB-COMPONENT: SIDEBAR ITEM ---
const SidebarItem = ({ icon: Icon, label, activeTab, setActiveTab }) => (
  <div 
    onClick={() => setActiveTab(label)}
    className={`flex items-center gap-3 p-3.5 mb-2 cursor-pointer rounded-2xl transition-all duration-300 group ${
      activeTab === label 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'hover:bg-blue-50 text-gray-500'
    }`}
  >
    <div className={`${activeTab === label ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'} transition-colors`}>
      <Icon size={20} />
    </div>
    <span className={`font-bold text-sm ${activeTab === label ? 'text-white' : 'text-gray-600'}`}>{label}</span>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data States
  const [toursList, setToursList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [counts, setCounts] = useState({ users: 0, tours: 0, bookings: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Giả lập delay để tạo hiệu ứng chuyên nghiệp cho video demo
        await new Promise(resolve => setTimeout(resolve, 1500));

        const files = [
          { name: 'users.csv', key: 'users' },
          { name: 'tours.csv', key: 'tours' },
          { name: 'bookings.csv', key: 'bookings' }
        ];

        for (const file of files) {
          const response = await fetch(`/data/raw/${file.name}`);
          if (!response.ok) throw new Error(`Không thể kết nối Pipeline: ${file.name}`);
          
          const csvText = await response.text();
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: 'greedy',
            complete: (results) => {
              const cleanData = results.data.filter(row => 
                Object.values(row).some(val => val !== "" && val !== null)
              );

              setCounts(prev => ({ ...prev, [file.key]: cleanData.length }));

              if (file.key === 'tours') setToursList(cleanData);
              if (file.key === 'bookings') {
                setBookingsList(cleanData);
                // --- FIX LOGIC REVENUE: Chỉ đơn Confirmed mới tính tiền ---
                const totalConfirmedRevenue = cleanData.reduce((sum, row) => {
                  const isConfirmed = row.status?.toLowerCase() === 'confirmed';
                  const price = parseFloat(row.total_price || row.price || 0);
                  return isConfirmed ? sum + price : sum;
                }, 0);
                setRevenue(totalConfirmedRevenue);
              }
            }
          });
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-400 font-bold animate-pulse uppercase tracking-[0.3em] text-[10px]">
          TourGo Cloud Engine Connecting...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] p-6">
        <div className="bg-white p-10 rounded-[40px] shadow-xl text-center border border-red-100">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Data Pipeline Error</h2>
          <p className="text-gray-500 mt-2 mb-8">{error}</p>
          <button onClick={() => window.location.reload()} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Khởi động lại hệ thống
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-100">
      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-gray-100 p-8 flex flex-col fixed h-full z-20 shadow-sm">
        <div className="flex items-center gap-3 mb-14">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-100">
            <TrendingUp className="text-white" size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-none tracking-tighter uppercase">TOURGO</h1>
            <p className="text-[10px] font-black text-blue-600 tracking-[0.3em] uppercase mt-1">Analytics</p>
          </div>
        </div>
        
        <nav className="flex-1">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-6 px-2 tracking-[0.2em] opacity-60">Management</p>
          <SidebarItem icon={LayoutDashboard} label="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem icon={DollarSign} label="Revenue" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem icon={Map} label="Top Tours" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem icon={ClipboardList} label="Bookings" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem icon={Users} label="Customers" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>

        <div className="mt-auto">
          <div className="bg-gray-900 p-6 rounded-[32px] text-white relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3 italic">Authorized Developer</p>
            <p className="text-lg font-black tracking-tight uppercase leading-none mb-1">Khánh Khuất Quốc</p>
            <p className="text-[10px] text-gray-400 font-medium">Data Science Student</p>
            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
               <span className="text-[10px] text-gray-500 font-mono">ID: 23711381</span>
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-80 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12 max-w-[1440px] mx-auto px-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-[2px] w-10 bg-blue-600"></div>
              <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em]">Real-time Dashboard</p>
            </div>
            <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
              {activeTab}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-4 rounded-[20px] font-black text-sm text-gray-700 shadow-sm">
              <Calendar size={20} className="text-blue-600" />
              <span>23 / 04 / 2026</span>
            </div>
          </div>
        </header>

        <div className="max-w-[1440px] mx-auto px-4">
          {activeTab === 'Overview' && (
  <div className="w-full space-y-8 animate-in fade-in duration-700">
    
    {/* Hàng Stats: 4 cột đều nhau trải dài hết màn hình */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      <StatsCard title="TỔNG ĐƠN ĐẶT" value={counts.bookings.toLocaleString()} percent="+12%" icon={ClipboardList} color="blue" />
      <StatsCard title="DOANH THU" value="3.4 T" percent="Thực tế" icon={DollarSign} color="green" />
      <StatsCard title="TOUR HOẠT ĐỘNG" value={counts.tours.toLocaleString()} percent="Sẵn sàng" icon={Map} color="purple" />
      <StatsCard title="NGƯỜI DÙNG" value={counts.users.toLocaleString()} percent="+5.4%" icon={Users} color="orange" />
    </div>

    {/* Hàng Biểu đồ: Chia tỷ lệ 6-6 để cả 2 cùng bự và tràn đều 2 bên */}
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full">
      
      {/* Biểu đồ Xu hướng - Chiếm 6/12 cột */}
      <div className="xl:col-span-6 bg-white p-10 rounded-[45px] shadow-sm border border-gray-50 flex flex-col h-[550px]">
        <h4 className="text-[11px] font-black mb-8 uppercase tracking-[0.3em] text-gray-400">Xu hướng doanh thu & Đơn đặt</h4>
        <div className="flex-1 w-full">
          <RevenueLineChart data={revenueData} />
        </div>
      </div>

      {/* Biểu đồ Top Tours - Chiếm 6/12 cột (Bự ra và sát lề phải) */}
      <div className="xl:col-span-6 bg-white p-10 rounded-[45px] shadow-sm border border-gray-50 flex flex-col h-[550px]">
        <h4 className="text-[11px] font-black mb-8 uppercase tracking-[0.3em] text-gray-400 text-center">Top 10 Tours tiêu biểu</h4>
        <div className="flex-1 w-full min-w-0">
          {/* Tăng kích thước thực tế của biểu đồ bên trong */}
          <div className="w-full h-full transform scale-110 origin-center">
            <TopToursBarChart data={topToursData} />
          </div>
        </div>
      </div>

    </div>
  </div>
)}
         {activeTab === 'Revenue' && (
  <div className="space-y-10 animate-in fade-in duration-700">
    <div className="bg-white p-10 md:p-14 rounded-[50px] border border-gray-50 shadow-sm text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      
      <p className="text-gray-400 font-black uppercase text-[11px] tracking-[0.4em] mb-6">
        Net Confirmed Revenue
      </p>

      {/* GIẢI PHÁP MỚI: Dùng container giới hạn chiều rộng để ép chữ phải co lại */}
      <div className="max-w-[90%] mx-auto flex items-baseline justify-center gap-2">
        <h3 
          style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.8rem)', // Giảm mức tối đa từ 4.5 xuống 3.8rem
            letterSpacing: '-0.05em',
            lineHeight: '1',
            wordBreak: 'break-all'
          }}
          className="font-black text-gray-900 italic tracking-tighter"
        >
          {/* Tách phần số ra để kiểm soát kích thước tốt hơn */}
          {revenue.toLocaleString('vi-VN')}
        </h3>
        <span className="text-2xl md:text-3xl font-black text-blue-600 italic">₫</span>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="h-[1px] w-20 bg-gray-100"></div>
        <p className="text-green-600 font-bold text-[10px] uppercase tracking-[0.2em] bg-green-50 px-5 py-1.5 rounded-full border border-green-100">
           Hệ thống đã xác thực
        </p>
      </div>
    </div>

    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
      <h4 className="text-sm font-black mb-6 uppercase tracking-widest text-gray-400">Biểu đồ tăng trưởng</h4>
      <RevenueLineChart data={bookingsList} />
    </div>
  </div>
)}

          {activeTab === 'Bookings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white rounded-[40px] shadow-sm border border-gray-50 p-4">
              <BookingTable data={bookingsList} />
            </div>
          )}

          {activeTab === 'Top Tours' && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <div className="bg-white p-10 rounded-[40px] border border-gray-50 shadow-sm">
                <TopToursBarChart data={topToursData} />
              </div>
              <div className="bg-white rounded-[40px] border border-gray-50 shadow-sm overflow-hidden p-10">
                <h4 className="text-2xl font-black mb-8 italic uppercase tracking-tighter underline underline-offset-8 decoration-blue-600">Inventory Catalog</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {toursList.map((tour, i) => (
                    <div key={i} className="p-6 border border-gray-50 bg-gray-50/40 rounded-3xl flex justify-between items-start hover:shadow-md hover:border-blue-100 transition-all group">
                      <div>
                        <p className="font-black text-gray-800 text-base group-hover:text-blue-600 transition-colors">{tour.name}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase mt-2 tracking-widest">{tour.destination}</p>
                      </div>
                      <p className="font-black text-blue-600 text-sm whitespace-nowrap ml-4">
                        {currencyFormatter.format(parseInt(tour.price || 0))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Customers' && (
            <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-[50px] border border-gray-50 shadow-sm animate-in zoom-in-95 duration-500 relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
              <div className="w-28 h-28 bg-orange-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <Users size={48} className="text-orange-500" />
              </div>
              <p className="text-gray-400 font-black uppercase text-xs tracking-[0.5em] relative z-10">Total Verified Users</p>
              <p className="text-8xl font-black text-gray-900 mt-6 tracking-tighter italic relative z-10">{counts.users} <span className="text-3xl text-blue-600">PAX</span></p>
              <div className="mt-12 flex gap-4 relative z-10">
                <span className="px-6 py-2 bg-gray-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Active Database</span>
                <span className="px-6 py-2 border-2 border-blue-600 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest italic">Sync: Success</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;