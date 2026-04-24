import React from 'react';
import { MoreHorizontal, Eye } from 'lucide-react';

const BookingTable = ({ data = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">
            <th className="pb-4 pl-6">Mã Đơn</th>
            <th className="pb-4">Tên Khách Hàng</th>
            <th className="pb-4">Tour / Dịch Vụ</th>
            <th className="pb-4">Ngày Đặt</th>
            <th className="pb-4 text-center">Trạng Thái</th>
            <th className="pb-4 text-right pr-6">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? data.map((booking, index) => (
            <tr key={index} className="bg-white hover:bg-blue-50/50 transition-colors group">
              <td className="py-4 pl-6 rounded-l-[20px] border-y border-l border-gray-50 font-bold text-blue-600 text-sm">
                #{booking.id || `BK${1000 + index}`}
              </td>
              <td className="py-4 border-y border-gray-50">
                <div className="font-bold text-gray-900 text-sm">{booking.customer_name || "Khách ẩn danh"}</div>
                <div className="text-[10px] text-gray-400 font-medium">{booking.email || "No email"}</div>
              </td>
              <td className="py-4 border-y border-gray-50">
                <div className="font-bold text-gray-700 text-sm">{booking.tour_name}</div>
                <div className="text-[10px] text-blue-500 font-bold uppercase">{booking.category || "Tour"}</div>
              </td>
              <td className="py-4 border-y border-gray-50 text-sm text-gray-500 font-medium">
                {booking.booking_date}
              </td>
              <td className="py-4 border-y border-gray-50 text-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                  booking.status === 'Confirmed' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-orange-100 text-orange-600'
                }`}>
                  {booking.status || 'Pending'}
                </span>
              </td>
              <td className="py-4 pr-6 rounded-r-[20px] border-y border-r border-gray-50 text-right">
                <button className="p-2 hover:bg-white rounded-xl transition-shadow group-hover:shadow-sm">
                  <Eye size={16} className="text-gray-400 group-hover:text-blue-600" />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="text-center py-10 text-gray-400 font-bold italic">
                Chưa có dữ liệu đơn hàng...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;