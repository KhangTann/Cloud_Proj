import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const BookingTable = () => {
  // 1. Mock data 20 records
  const mockBookings = Array.from({ length: 20 }, (_, i) => ({
    booking_id: `BK${1000 + i}`,
    user_name: i % 2 === 0 ? "Khuất Quốc Khánh" : "Nguyễn Tấn Khang",
    tour_name: i % 3 === 0 ? "Tour Ha Long Luxury" : "Tour Phu Quoc Beach",
    date: `2026-04-${(i % 28) + 1}`,
    total_price: (2000000 + i * 500000),
    status: i % 3 === 0 ? 'confirmed' : i % 3 === 1 ? 'pending' : 'cancelled'
  }));

  // 2. Logic Phân trang (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = mockBookings.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(mockBookings.length / rowsPerPage);

  // 3. Helper hiển thị màu sắc Status
  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header của bảng */}
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
        <h3 className="text-xl font-bold text-gray-800">Quản lý Đặt chỗ (Bookings)</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm mã đơn, khách hàng..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Tên Tour</th>
              <th className="px-6 py-4">Ngày đặt</th>
              <th className="px-6 py-4 text-right">Tổng tiền</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentRows.map((item) => (
              <tr key={item.booking_id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-blue-600">{item.booking_id}</td>
                <td className="px-6 py-4 font-medium text-gray-700">{item.user_name}</td>
                <td className="px-6 py-4 text-gray-600">{item.tour_name}</td>
                <td className="px-6 py-4 text-gray-500">{item.date}</td>
                <td className="px-6 py-4 text-right font-black text-gray-900">
                  {item.total_price.toLocaleString()}đ
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
        <p className="text-sm text-gray-500 font-medium">
          Hiển thị {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, mockBookings.length)} trong số {mockBookings.length} đơn
        </p>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center px-4 font-bold text-sm text-blue-600">
             Trang {currentPage} / {totalPages}
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingTable;