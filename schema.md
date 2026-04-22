# TOURGO - DATA SCHEMA DEFINITION

Tài liệu này xác định cấu trúc dữ liệu chuẩn cho dự án TOURGO. Tất cả các thành viên (Data Engineer, Backend, Frontend) phải tuân thủ schema này để tránh xung đột hệ thống.

---

### 1. Bảng `users` (Thông tin người dùng)
Lưu trữ thông tin cá nhân của khách hàng.

| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `user_id` | Integer (PK) | Mã định danh duy nhất của người dùng |
| `full_name` | String | Họ và tên đầy đủ |
| `email` | String | Địa chỉ email (Dùng để đăng nhập/liên lạc) |
| `phone` | String | Số điện thoại |
| `created_at` | Date/Timestamp | Ngày tạo tài khoản |
| `city` | String | Thành phố đang sinh sống |

---

### 2. Bảng `tours` (Thông tin Tour du lịch)
Lưu trữ danh sách các gói tour có sẵn.

| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `tour_id` | Integer (PK) | Mã định danh duy nhất của tour |
| `name` | String | Tên gọi của tour |
| `destination` | String | Điểm đến (Đà Nẵng, Phú Quốc, Sapa...) |
| `price` | Decimal/Long | Giá tiền cho 1 người (VNĐ) |
| `duration_days` | Integer | Số ngày diễn ra tour |
| `category` | String | Loại hình (Biển, Núi, Văn hóa, Sang trọng...) |
| `available_slots`| Integer | Số chỗ còn trống |

---

### 3. Bảng `bookings` (Thông tin đặt tour)
Lưu trữ các giao dịch đặt tour của người dùng.

| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `booking_id` | Integer (PK) | Mã định danh duy nhất của đơn đặt tour |
| `user_id` | Integer (FK) | Liên kết với bảng `users` |
| `tour_id` | Integer (FK) | Liên kết với bảng `tours` |
| `booking_date` | Date | Ngày khách hàng thực hiện đặt tour |
| `travel_date` | Date | Ngày khách hàng sẽ đi du lịch |
| `num_people` | Integer | Số lượng người đi cùng |
| `total_price` | Decimal/Long | Tổng tiền (Thường bằng `num_people` * `tour.price`) |
| `status` | String | Trạng thái: `confirmed`, `cancelled`, `pending` |

---

### Lưu ý cho Pipeline:
- **Bronze Layer**: Giữ nguyên tên cột và kiểu dữ liệu từ file CSV.
- **Silver Layer**: Phải thực hiện ép kiểu (casting) đúng cho các cột `date` và `price`.
- **Gold Layer**: Các bảng KPI phải dựa trên quan hệ giữa `user_id` và `tour_id` từ bảng `bookings`.
